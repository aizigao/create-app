import path from 'path'

export const getExtFromFilePath = (filePath) => {
  return filePath.split('.').pop()
}

/**
 * 排除 隐藏文件
 */
export const filterFunc = (item) => {
  const basename = path.basename(item)
  return basename === '.' || basename[0] !== '.'
}
