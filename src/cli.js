import yargs from 'yargs'
import inquirer from 'inquirer'
import arg from 'arg'
import { promisify } from 'util'
import { createProject } from './main'

import figlet from 'figlet'

figlet('MY_CLI', function (err, data) {
  if (err) {
    console.log('Something went wrong...')
    console.dir(err)
    return
  }
  console.log(data)
})

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  )
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false,
  }
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'JavaScript'
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }

  const questions = []
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which project template to use',
      choices: ['JavaScript', 'TypeScript'],
      default: defaultTemplate,
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: false,
    })
  }

  const answers = await inquirer.prompt(questions)
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  await createProject(options)
}
