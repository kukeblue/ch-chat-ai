// import useAuthStore  from '@/store/authStore'

export function setupPageGuard(router) {
  router.beforeEach(async (to, from, next) => {
    // const authStore = useAuthStore((state) => state)
    console.log('debug do setupPageGuard')
    // if (!authStore.session) {
    //   try {
    //     const data = await authStore.getSession()
    //     if (String(data.auth) === 'false' && authStore.token)
    //       authStore.removeToken()
    //     if (to.path === '/500')
    //       next({ name: 'Root' })
    //     else
    //       next()
    //   }
    //   catch (error) {
    //     if (to.path !== '/500')
    //       next({ name: '500' })
    //     else
    //       next()
    //   }
    // }
    // else {
    //   next()
    // }
    next()
  })
}
