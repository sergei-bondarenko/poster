'use strict'

const storage = new Vuex.Store({
    strict: true,
    state: {
        site_title: '',
        site_description: '',
        posts: [],
        likes: {},
        comments: {},
        url: '',
        site_info: {},
        posteditor: {
            post_id: null,
            body: ''
        },
        modal: {
            show: false,
            message: '',
            buttonText: '',
            buttonClass: '',
            action: '',    // One of: 'delPost', 'delComment' and 'info'
            id: null,
            affirmed: false
        }
    },

    getters: {
        getModal: state => () => state.modal,
        getPosts: state => () => state.posts
    },

    mutations: {
        createModal(state, payload) {
            state.modal.show = true
            state.modal.message = payload.message
            state.modal.buttonText = payload.buttonText
            state.modal.buttonClass = payload.buttonClass
            state.modal.action = payload.action
            state.modal.id = payload.id
            state.modal.affirmed = false
        },
        
        destroyModal(state) {
            state.modal.show = false
            state.modal.message = ''
            state.modal.buttonText = ''
            state.modal.buttonClass = ''
            state.modal.action = ''
            state.modal.affirmed = ''
            state.modal.id = null
        },

        modalAffirmed(state) {
            state.modal.affirmed = true
            state.modal.show = false
        },

        updateState(state, payload) {
            for (let i in payload) {
                state[i] = payload[i]
            }
        },
        
        setPosteditor(state, payload) {
            if (payload.post_id !== undefined) {
                state.posteditor.post_id = payload.post_id
            }
            state.posteditor.body = payload.body
        },

        loadURL(state) {
            // Get post id from address bar
            state.url = window.location.search.substring(1)
                .replace(/[&?]*wrapper_nonce=[A-Za-z0-9]+/, '')
                .replace(/post=/, '')
        },

        async loadSiteInfo(state) {
            let contentJSON = JSON.parse(await poster.getContentJSON())
            this.commit('updateState', {
                'site_info': await poster.getSiteInfo(),
                'site_title': contentJSON.title,
                'site_description': contentJSON.description
            })
        },

        async loadPosts(state, payload) {
            let query = null

            if (state.url != '') {
                query = "SELECT * FROM post WHERE post_id=" + state.url
            } else {
                if (payload === undefined) {
                    query = "SELECT * FROM post ORDER BY date_published DESC"
                } else {
                    let date = 0
                    let order = null
                    if (payload.order == 'likes') {
                        order = 'votes'
                        switch (payload.timespan) {
                            case 'day':
                                date = + new Date() - 24 * 3600 * 1000
                                break
                            case 'week':
                                date = + new Date() - 7 * 24 * 3600 * 1000
                                break
                            case 'month':
                                date = + new Date() - 30 * 24 * 3600 * 1000
                                break
                            case 'year':
                                date = + new Date() - 365 * 24 * 3600 * 1000
                                break
                        }
                    }
                    if (payload.order == 'comments') {
                        order = 'last_comment'
                    }
                    query = "SELECT post.*, COUNT(comment_id) AS comments, "
                        + "MAX(comment.date_added) AS last_comment, "
                        + "(SELECT COUNT(*) FROM post_vote "
                        + "WHERE post_vote.post_id = post.post_id) "
                        + "AS votes FROM post LEFT JOIN comment "
                        + "USING (post_id) WHERE date_published > "
                        + date + " GROUP BY post_id "
                        + "ORDER BY " + order + " DESC"
                }
            }
            this.commit('updateState', {'posts': await poster.sqlQuery(query)})
        },

        async loadLikes(state) {
            let query = "SELECT post_id, directory FROM json "
                + "LEFT JOIN post_vote USING (json_id) "
                + "WHERE file_name='data.json' "
                + "AND directory != ''"
            let likes_arr = await poster.sqlQuery(query)
            this.commit('updateState', {'likes': {}})
            likes_arr.forEach((like) => {
                if ( !(like.post_id in state.likes) ) {
                    state.likes[like.post_id] = []
                }
                state.likes[like.post_id].push(
                    like.directory.replace('users/', ''))
            })
        },

        async loadComments(state) {
            let query = "SELECT comment.*, json_content.json_id "
              + "AS content_json_id, keyvalue.value AS cert_user_id, "
              + "json.directory, (SELECT COUNT(*) FROM comment_vote "
              + "WHERE comment_vote.comment_uri = comment.comment_id || "
              + "'@' || json.directory)+1 AS votes "
              + "FROM comment "
              + "LEFT JOIN json USING (json_id) "
              + "LEFT JOIN json AS json_content ON "
              + "(json_content.directory = json.directory "
              + "AND json_content.file_name='content.json') "
              + "LEFT JOIN keyvalue ON "
              + "(keyvalue.json_id = json_content.json_id "
              + "AND key = 'cert_user_id') "
              + "ORDER BY date_added DESC"
            let comments_arr = await poster.sqlQuery(query)
            this.commit('updateState', {'comments': {}})
            comments_arr.forEach((comment) => {
                if ( !(comment.post_id in state.comments) ) {
                    state.comments[comment.post_id] = []
                }
                state.comments[comment.post_id].push(comment)
            })
        }
    }
})
