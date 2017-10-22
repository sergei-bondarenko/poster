Vue.component('comments', {
    template: `
        <div>
            <div v-for="comment in comments" v-if="comment.post_id == post_id" class="comment">
                <div class="comment-info">
                    <span class="comment-username">{{ comment.cert_user_id }}</span>
                    ━
                    <span class="comment-date">{{ comment.date_added }}</span>
                </div>
                <div class="comment-body">
                    {{ comment.body }}
                </div>
            </div>
            <textarea class="comment-textarea" ref="commentarea"></textarea>
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
        this.load()
    },

    methods: {
        load() {
            page.cmdp('dbQuery', [
                "SELECT comment.*, json_content.json_id AS content_json_id, keyvalue.value AS cert_user_id, json.directory,"
              + "(SELECT COUNT(*) FROM comment_vote WHERE comment_vote.comment_uri = comment.comment_id || '@' || json.directory)+1 AS votes "
              + "FROM comment "
              + "LEFT JOIN json USING (json_id) "
              + "LEFT JOIN json AS json_content ON (json_content.directory = json.directory AND json_content.file_name='content.json') "
              + "LEFT JOIN keyvalue ON (keyvalue.json_id = json_content.json_id AND key = 'cert_user_id') "
              + "ORDER BY date_added DESC"]).then((res) => {
                this.comments = []
                res.forEach((comment) => {
                    this.comments.push({
                        comment_id: comment['comment_id'],
                        post_id: comment['post_id'],
                        body: comment['body'],
                        date_added: comment['date_added'],
                        cert_user_id: comment['cert_user_id']
                    })
                })
            })
        },

        save() {
            page.cmdp('siteInfo', []).then((site_info) => {
                if (site_info.cert_user_id == null) {
                    page.site_info = site_info
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
                        'topic_vote': {}
                    }
                }

                data.comment.push({
                    'comment_id': data.next_comment_id,
                    'body': this.$refs.commentarea.value,
                    'post_id': this.post_id,
                    'date_added': + new Date()
                })

                data.next_comment_id += 1
                page.writePublish('data/users/' + page.site_info.auth_address + '/data.json', data)
            }).catch((err) => {
                console.log(err)
            })
        }
    }
})
