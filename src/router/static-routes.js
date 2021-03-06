export default [
  { path: '/', name: 'layout', component: () => import('@/layout/index'), redirect: '/login', children: [
    { path: 'test/111', name: 'test-111', meta: { title: '测试111', pName: 'aa项目=>测试111' }, component: () => import('@/views/test/111') },
    { path: 'test/222', name: 'test-222', meta: { title: '测试222', pName: 'aa项目=>测试222' }, component: () => import('@/views/test/222') },
    { path: 'demo/1', name: 'demo-1', meta: { title: 'demo1', pName: '' }, component: () => import('@/views/demo/1') },
  ]},
  { path: '/login', name: 'login', meta: { title: '登录' }, component: () => import('@/views/login') }
]