import yargs from 'yargs/yargs'
import inquirer from 'inquirer'
import path from 'path'
import chalk from 'chalk'
import _ from 'lodash'
import { createProject } from './main'
import { templateList, defaultTemplate } from './config'

/**
 * 格式化 argv
 */
function parseArgvIntoOptions(rawArgs) {
  const argv =
    // --
    yargs(rawArgs)
      .usage('Usage: $0 [options...] [folder-name]')
      .option('template', {
        describe: '项目模板名称',
        alias: 't',
        type: 'string',
        choices: templateList,
      })
      .option('install', {
        describe: '初始后立即 npm install',
        type: 'boolean',
      })
      .option('git', {
        describe: '是否初始化git',
        type: 'boolean',
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
    targetDirectory: argv._[0] && path.join(process.cwd(), argv._[0]),
  }
}

/**
 * 待用户确认与选择参数
 */
async function promptForMissingOptions(options) {
  const questions = []
  if (_.isNil(options.template)) {
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
    default: 'test_project',
  })

  questions.push({
    type: 'string',
    name: 'description',
    message: '项目描述',
    default: '由@aizigao/create-app 创建',
  })

  if (_.isNil(options.git)) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: '是否初始git',
      default: false,
    })
  }

  if (_.isNil(options.install)) {
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
  process.exit(0)
}
