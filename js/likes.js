Vue.component('likes', {
    template: `
        <div>
            <p class="is-size-7">1 day ago</p>
            <i class="fa fa-heart-o" aria-hidden="true" @click="save"></i>
            <p>{{ likes }}</p>
        </div>
    `,
    
    props: ['post_id'],

    data() {
        return {
            likes: 0
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
            page.cmdp('dbQuery', ["SELECT count(*) AS likes from post_vote WHERE post_id=" + this.post_id]).then((res) => {
                this.likes = res[0].likes
            })
        },

        save() {
            page.cmdp('siteInfo', []).then((site_info) => {
                page.site_info = site_info
                if (site_info.cert_user_id == null) {
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
                data.post_vote[this.post_id] = 1
                page.writePublish('data/users/' + page.site_info.auth_address + '/data.json', data)

            }).catch((err) => {
                console.log(err)
            })
        }
    }
})
