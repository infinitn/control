const npminstall = [
  {
    path: 'ELementUi',
    name: 'ELementUi',
    component: resolve => require(['../views/homepage/npminstall/ElementUi'],resolve)
  },
  {
    path: 'Scss',
    name: 'Scss',
    component: resolve => require(['../views/homepage/npminstall/Scss'],resolve)
  }
]

export default npminstall;