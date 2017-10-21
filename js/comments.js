Vue.component('comments', {
    template: `
        <div>
                {{ post_id }}
            <div v-for="comment in comments" class="comment">
                {{ post_id }}
            </div>
            <textarea class="comment-textarea"></textarea>
            <button type="button" @click="save">Save</button>
        </div>
    `,
    
    props: ['post_id'],

    data() {
        return {
            comments: []
        }
    },

    mounted() {
    },

    methods: {
        load() {
            //page.cmdp('dbQuery', ["SELECT * FROM comment"]).then((res) => {
                //this.posts = []
                //res.forEach((post) => {
                    //this.posts.push({
                        //post_id: post['post_id'],
                        //body: post['body'],
                        //date_published: post['date_published']
                    //})
                //})
            //})
        },

        save() {
            //let data = null
            //page.cmdp('fileGet', ['data/data.json']).then((file) => {
                //data = JSON.parse(file)
                //data.post.push({
                    //'post_id': data.next_post_id,
                    //'date_published': + new Date(),
                    //'body': this.$refs.postarea.value
                //})
                //data.next_post_id += 1
                //data = JSON.stringify(data, null, '    ')
                //return page.cmdp('fileWrite', ['data/data.json', btoa(data)])
            //}).then((res) => {
                //this.$refs.postarea.value = ''
                //bus.$emit('update')
                //return page.cmdp('siteSign', ['stored'])
            //}).then((res) => {
                //return page.cmdp('sitePublish', ['stored'])
            //})
            //
            page.cmdp('siteInfo', []).then((site_info) => {
                if (site_info.cert_user_id == null) {
                    page.cmdp('wrapperNotification', ['info', "Please, select your account."])
                } else {
                    return page.cmdp('fileGet', ['data/users/' + site_info.auth_address + '/data.json'])
                }
            }).then((data) => {
                if (data) {
                    data = JSON.parse(data)
                } else {
                    data = {
                        'next_comment_id': 1,
                        'comment': [],
                        'comment_vote': {},
                        'topic_vote': {}
                    }
                }

                //data.comment.push {
                    //'comment_id': data.next_comment_id,
                    //'body': body,
                    //'post_id': @post_id,
                    //'date_added': Time.timestamp()
                //}
            })
        }
    }
})
