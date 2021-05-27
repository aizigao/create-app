export const templateConfigList = [
  {
    name: 'remax_mini',
    desc: 'reamx 小程序项目',
  },
  {
    name: 'vanilla_mobile',
    desc: 'vanilla mobile',
  },
  {
    name: 'test',
    desc: 'test 项目',
  },
]

export const templateList = templateConfigList.map((item) => item.name)
export const defaultTemplate = 'remax_mini'
