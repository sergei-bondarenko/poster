Vue.component('likes', {
    template: `
        <div>
            <p class="is-size-7">{{ date_published }}</p>
            <i class="fa" :class="{'fa-heart': liked, 'fa-heart-o': !liked}" aria-hidden="true" @click="like"></i>
            <p>{{ likes }}</p>
        </div>
    `,
    
    props: ['post_id', 'date_published'],

    data() {
        return {
            likes: 0,
            liked: false
        }
    },

    mounted() {
        this.load()
        bus.$on('update', () => {
            this.load()
        })
    },

    methods: {
        load() {
            page.cmdp('siteInfo', []).then((site_info) => {
                page.site_info = site_info
                return page.cmdp('dbQuery', ["SELECT count(*) AS likes from post_vote WHERE post_id=" + this.post_id])
            }).then((res) => {
                this.likes = res[0].likes
                return page.cmdp('dbQuery', ["SELECT 'post_vote' AS type, post_id AS uri "
                  + "FROM json LEFT JOIN post_vote USING (json_id) "
                  + "WHERE directory = 'users/" + page.site_info.auth_address + "' "
                  + "AND file_name = 'data.json' "
                  + "AND uri=" + this.post_id])
            }).then((res) => {
                if (res.length > 0) {
                    this.liked = true
                } else {
                    this.liked = false
                }
            })
        },

        like() {
            page.cmdp('siteInfo', []).then((site_info) => {
                page.site_info = site_info
                if (page.site_info.cert_user_id == null) {
                    page.cmdp('certSelect', {'accepted_domains': ['zeroid.bit']})
                    return Promise.reject("Certificate is not selected")
                } else {
                    return page.cmdp('fileGet', ['data/users/' + page.site_info.auth_address + '/data.json'])
                }
            }).then((data) => {
                if (data) {
                    data = JSON.parse(data)
                } else {
                    data = {
                        'next_comment_id': 1,
                        'comment': [],
                        'comment_vote': {},
                        'post_vote': {}
                    }
                }

                if (this.liked) {
                    delete data.post_vote[this.post_id]
                } else {
                    data.post_vote[this.post_id] = 1
                }

                page.writePublish('data/users/' + page.site_info.auth_address + '/data.json', data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
})
