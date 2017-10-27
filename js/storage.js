const storage = new Vuex.Store({
    state: {
        posts: [],
        likes: [],
        url: '',
        site_info: ''
    },

    mutations: {
        loadURL(state) {
            // Get post id from address bar
            state.url = window.location.search.substring(1)
                .replace(/[&?]*wrapper_nonce=[A-Za-z0-9]+/, '')
                .replace(/post=/, '')
        },

        async loadSiteInfo(state) {
            state.site_info = await page.getSiteInfo()
        },

        async loadPosts(state) {
            let query = null

            if (state.url == '') {
                query = "SELECT * FROM post ORDER BY date_published DESC"
            } else {
                query = "SELECT * FROM post WHERE post_id=" + state.url
            }

            state.posts = await page.sqlQuery(query)
        },

        async loadLikes(state) {
            query = "SELECT post_id, directory FROM json "
                + "LEFT JOIN post_vote USING (json_id) "
                + "WHERE file_name='data.json' "
                + "AND directory != ''"
            let likes_arr = await page.sqlQuery(query)
            state.likes = {}
            likes_arr.forEach((like) => {
                if ( !(like.post_id in state.likes) ) {
                    state.likes[like.post_id] = []
                }
                state.likes[like.post_id].push(like.directory.replace('users/', ''))
            })
        }
    }
})
