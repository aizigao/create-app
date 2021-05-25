import yargs from 'yargs/yargs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import dayjs from 'dayjs'
import { createProject } from './main'
import { templateList } from './config'

function parseArgvIntoOptions(rawArgs) {
  const argv =
    // --
    yargs(rawArgs)
      .usage('Usage: $0 [options]')
      .option('template', {
        describe: '项目模板名称',
        alias: 't',
        type: 'string',
        choices: templateList,
      })
      .option('install', {
        describe: '初始后立即 npm install',
        type: 'boolean',
        default: false,
      })
      .option('git', {
        describe: '是否初始化git',
        type: 'boolean',
        default: false,
      })
      .example('$0 --install', chalk.yellow('创建项目后npm install'))
      .example('$0 --git', chalk.yellow('创建项目后 git init'))
      .example('$0 --template remax_mini', chalk.yellow('直接选择模板创建'))
      .alias('v', 'version')
      .help('h')
      .alias('h', 'help').argv

  return {
    git: argv.git,
    template: argv.template,
    install: argv.install,
  }
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript'

  const questions = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices: templateList,
      default: defaultTemplate,
    })
  }

  questions.push({
    type: 'string',
    name: 'name',
    message: '项目名称',
    default: '项目' + '_' + dayjs().format('YYYY_MM_DD'),
  })

  questions.push({
    type: 'string',
    name: 'description',
    message: '项目描述',
    default: '由@aizigao/create-app 创建',
  })

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: '是否初始git',
      default: false,
    })
  }

  if (!options.install) {
    questions.push({
      type: 'confirm',
      name: 'install',
      message: 'run yarn install now',
      default: false,
    })
  }

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    ...answers,
  }
}

export async function cli(args) {
  let options = parseArgvIntoOptions(args)
  options = await promptForMissingOptions(options)
  await createProject(options)
}
