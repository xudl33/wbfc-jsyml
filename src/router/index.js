import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', name: 'JS-YAML编辑器', component: () => import('../components/jsyaml-editor')  },
    { path: '/tplMaker', name: '模板编辑器', component: () => import('../components/tpl-maker')  },
  ],
  mode: 'history',
})
