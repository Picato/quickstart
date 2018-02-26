export default [
  {
    path: '${tbl}',
    name: '${Tbl}',
    component: () => import('@/components/${Tbl}'),
    meta: {
      gicon: 'fa-bank',
      icon: 'fa-bank',
      group: '${Tbl}'
    }
  }
]
