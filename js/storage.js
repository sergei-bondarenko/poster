const storage = new Vuex.Store({
    state: {
        posts: [],
        likes: {},
        comments: {},
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
            state.site_info = await poster.getSiteInfo()
        },

        async loadPosts(state) {
            let query = null

            if (state.url == '') {
                query = "SELECT * FROM post ORDER BY date_published DESC"
            } else {
                query = "SELECT * FROM post WHERE post_id=" + state.url
            }

            state.posts = await poster.sqlQuery(query)
        },

        async loadLikes(state) {
            let query = "SELECT post_id, directory FROM json "
                + "LEFT JOIN post_vote USING (json_id) "
                + "WHERE file_name='data.json' "
                + "AND directory != ''"
            let likes_arr = await poster.sqlQuery(query)
            state.likes = {}
            likes_arr.forEach((like) => {
                if ( !(like.post_id in state.likes) ) {
                    state.likes[like.post_id] = []
                }
                state.likes[like.post_id].push(like.directory.replace('users/', ''))
            })
        },

        async loadComments(state) {
            let query = "SELECT comment.*, json_content.json_id AS content_json_id, keyvalue.value AS cert_user_id, json.directory,"
              + "(SELECT COUNT(*) FROM comment_vote WHERE comment_vote.comment_uri = comment.comment_id || '@' || json.directory)+1 AS votes "
              + "FROM comment "
              + "LEFT JOIN json USING (json_id) "
              + "LEFT JOIN json AS json_content ON (json_content.directory = json.directory AND json_content.file_name='content.json') "
              + "LEFT JOIN keyvalue ON (keyvalue.json_id = json_content.json_id AND key = 'cert_user_id') "
              + "ORDER BY date_added DESC"
            let comments_arr = await poster.sqlQuery(query)
            state.comments = {}
            comments_arr.forEach((comment) => {
                if ( !(comment.post_id in state.comments) ) {
                    state.comments[comment.post_id] = []
                }
                state.comments[comment.post_id].push(comment)
            })
        }
    }
})
