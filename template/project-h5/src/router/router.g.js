export default [[% for(var i = 0; i < uilist.length; i++){ %]
  {
    path: [%= uilist[i].metaData.router_path ? uilist[i].metaData.router_path : `/${uilist[i].code}/views/${uilist[i].code}`%],
    name: '[%=uilist[i].code%]',
    meta: {
      pageName: '[%=uilist[i].name%]',
      phoneLogin: [%=uilist[i].metaData.phoneLogin%],
      keepAlive: [%=uilist[i].metaData.router_keepAlive%],
      wxLogin: [%=uilist[i].metaData.wxLogin%]
    },
    component: () => import(/* webpackChunkName: "[%=uilist[i].code%]" */ '../../src/components/[%=uilist[i].code%]/views/[%=uilist[i].code%].vue')
  }[%= i === uilist.length - 1 ? '' : ','%]
[% } %]
]