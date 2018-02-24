export default [
  {
    path: '${tbl}',
    name: '${Tbl}',
    component: () => import('@/components/Dynamic'),
    meta: {
      gicon: 'fa-bank',
      icon: 'fa-bank',
      group: '${Tbl}'
    }
  }
]
