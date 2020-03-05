module.exports = {
  title: 'Secret',
  base: '/blog/',
  description: 'Just playing around',
  markdown: {
    lineNumbers: true
  },
  plugins: ['@vuepress/back-to-top'],
  themeConfig: {
    displayAllHeaders: true,
    nav: [
      { text: 'Home', link: '/' },
      { text: '技术文档', link: '/blog/document/swiper' },
      { text: 'External', link: 'https://google.com' },
    ],
    sidebar: [
      {
        title: '技术文档', // 侧边栏名称
        children: [
          '/blog/document/swiper', // 你的md文件地址
          '/blog/document/infiniate',
          '/blog/document/YUIDoc',
          '/blog/document/mini',
          '/blog/document/fenxi',
          '/blog/document/this',
          '/blog/document/grid'
        ]
      },
      {
        title: '深入axios',
        children: [
          '/blog/axios/tools',
          '/blog/axios/constructor',
          '/blog/axios/config',
          '/blog/axios/mergeConfig',
          '/blog/axios/Axios',
          '/blog/axios/Interceptors',
          '/blog/axios/Dispatch'
        ]
      },
      {
        title: 'Express',
        children: [
          '/blog/express/ex',
          '/blog/express/middle',
          '/blog/express/in',
          '/blog/express/design'
        ]
      },
      {
        title: 'Node.js',
        children: [
          '/blog/Node/process',
          '/blog/Node/memory',
          '/blog/Node/sync'
        ]
      },
      {
        title: '算法',
        children: [
          '/blog/algo/dynamic'
        ]
      },
      {
        title: '跨域',
        children: [
          '/blog/kuayu/tongyuan',
          '/blog/kuayu/jsonp',
          '/blog/kuayu/cors',
          '/blog/kuayu/other'
        ]
      },
      {
        title: '学习轨迹',
        children: [
          '/blog/IN/track'
        ]
      },
      {
        title: '散文随笔', // 侧边栏名称
        children: [
          '/blog/article/notitle', // 你的md文件地址
          '/blog/article/cd',
          '/blog/article/sh',
          '/blog/article/nj'
        ]
      }
     ]
  }
}