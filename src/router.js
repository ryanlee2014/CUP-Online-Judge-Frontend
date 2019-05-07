import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import store from './store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/problemset',
      name: 'problemset',
      meta: {
        auth: true
      },
      component: () => import('./views/problemset.vue')
    },
    {
      path: '/status',
      name: 'status',
      meta: {
        auth: true
      },
      component: () => import('./views/status.vue')
    },
    {
      path: '/ranklist',
      name: 'ranklist',
      meta: {
        auth: true
      },
      component: () => import('./views/ranklist.vue')
    },
    {
      path: '/discuss',
      name: 'discuss',
      meta: {
        auth: true
      },
      component: () => import('./views/discuss.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/login.vue')
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('./views/faq.vue')
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.meta.auth) {
    if(store.state.logined) {
      next();
    }
    else if(sessionStorage.isLogined === "true") {
      store.commit("loginMutate", {login: true});
      next();
    }
    else {
      Vue.axios.get("/api/user/self").then(response => {
        if(response.data.data && response.data.data.user_id) {
          store.commit("loginMutate",{login: true});
          sessionStorage.isLogined = true;
          next();
        }
        else {
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            }
          })
        }
      });

    }
  }
  else {
    next();
  }
});

export default router;
