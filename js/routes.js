let router = new VueRouter({
    //mode: 'history',
    routes: [
        {
            path: '/',
            component: Posts
        },
        {
            path: '/post=:post_id',
            component: Post,
            props: true
        }
    ]
})
