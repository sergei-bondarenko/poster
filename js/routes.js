const routes = [
  { path: '/', component: Foo },
  { path: '/post', component: Bar }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router
}).$mount('#root')
