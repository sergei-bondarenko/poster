const storage = new Vuex.Store({
    state: {
        posts: [],
        comments: [],
        url: null
    },

    mutations: {
        updateUrl(state) {
            state.url = window.location.search.substring(1)
                .replace(/[&?]*wrapper_nonce=[A-Za-z0-9]+/, '')
                .replace(/post=/, '')
        },

        commitPosts(state, posts) {
            state.posts = posts
        }
    },

    actions: {
        loadPosts({ commit }) {
            page.cmdp('dbQuery', [
                "SELECT * FROM post ORDER BY date_published DESC"
            ]).then((res) => {
                commit('commitPosts', res)
            })
        }
    }
})
