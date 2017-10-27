const storage = new Vuex.Store({
    state: {
        posts: [],
        url: '',
        site_info: ''
    },

    mutations: {
        async loadSiteInfo(state) {
            // Load site_info
            state.site_info = await page.getSiteInfo()
        },

        async loadData(state) {
            let query = null

            // Get post id from address bar
            state.url = window.location.search.substring(1)
                .replace(/[&?]*wrapper_nonce=[A-Za-z0-9]+/, '')
                .replace(/post=/, '')

            // Load posts
            if (state.url == '') {
                query = "SELECT * FROM post ORDER BY date_published DESC"
            } else {
                query = "SELECT * FROM post WHERE post_id=" + state.url
            }

            state.posts = await page.sqlQuery(query)

            // Load likes
            let posts_new = []
            state.posts.forEach(async (post) => {
                post.likes = []
                query = "SELECT directory FROM json "
                    + "LEFT JOIN post_vote USING (json_id) "
                    + "WHERE post_id=" + post.post_id
                let likes_arr = await page.sqlQuery(query)
                post.likes = []
                likes_arr.forEach((like) => {
                    post.likes.push(like.directory.replace('users/', ''))
                })
                posts_new.push(post)
            })
            state.posts = posts_new
        }
    }
})
