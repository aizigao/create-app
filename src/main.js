import chalk from 'chalk'
import fs from 'fs-extra'
import ncp from 'ncp'
import path from 'path'
import { promisify } from 'util'
import consolidate from 'consolidate'
import klaw from 'klaw'
import execa from 'execa'
import Listr from 'listr'
import { projectInstall } from 'pkg-install'
import { getExtFromFilePath, filterFunc } from './utils'

const access = promisify(fs.access)
const copy = promisify(ncp)
const hbsRender = consolidate.handlebars

/**
 * 复制项目
 * @param {*} options
 * @returns
 */
async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, options.targetDirectory, {
    clobber: false,
  })
}

/**
 * 模板渲染
 */
async function renderTpl(options) {
  const hbsFiles = []
  /**
   * 遍历所有文件, 找到.hbs 的文件，然后render
   */
  for await (const file of klaw(options.targetDirectory, {
    filter: filterFunc,
  })) {
    const ext = getExtFromFilePath(file.path)
    if (ext === 'hbs') {
      hbsFiles.push(file)
    }
  }
  await Promise.all(
    hbsFiles.map(async (item) => {
      const renderContent = await hbsRender(item.path, options)
      await fs.writeFile(item.path.replace(/.hbs$/, ''), renderContent)
      fs.remove(item.path)
    })
  )
}

/**
 *
 * 初始化git
 * @param {*} options
 * @returns
 */
async function initGit(options) {
  const commands = [
    ['git', ['init']],
    ['git', ['add', '.']],
    ['git', ['commit', '-m', 'feat: created by @aizigao/create-app']],
  ]
  for (const command of commands) {
    const result = await execa(...command, {
      cwd: options.targetDirectory,
    })
    if (result.failed) {
      return Promise.reject(new Error('Failed to initialize git'))
    }
  }
}

/**
 * 创建app 主入口
 * @param {*} options
 * @returns
 */
export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  }

  const currentFileUrl = import.meta.url

  /**
   * 模板目录
   */
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.template.toLowerCase()
  )

  options.templateDirectory = templateDir

  try {
    await access(templateDir, fs.constants.R_OK)
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'))
    process.exit(1)
  }

  console.log(chalk.yellow('配置完成，初始化中'))

  const tasks = new Listr([
    {
      title: '复制文件',
      task: () => copyTemplateFiles(options),
    },
    {
      title: '渲染模板',
      task: () => renderTpl(options),
    },
    {
      title: '初始化 git',
      task: () => initGit(options),
      enabled: () => options.git,
    },
    {
      title: 'yarn install',
      task: () =>
        projectInstall({
          cwd: options.targetDirectory,
        }),
      skip: () => (!options.install ? '跳过 yarn install' : undefined),
    },
  ])

  await tasks.run()

  console.log('%s 创建成功啦啦啦', chalk.green.bold('DONE'))
  return true
}
