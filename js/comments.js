Vue.component('comments', {
    template: `
        <div>
            <div v-for="comment in comments" class="comment">
                <div class="comment-info">
                    <span class="comment-username" :title="userTitle(comment)" v-text="cropIdProvider(comment.cert_user_id)"></span>
                    ━
                    <span class="comment-date">{{ comment.date_added | fromNow }}</span>
                    <span class="pointer" @click="reply(comment.cert_user_id)"><i class="fa fa-reply" aria-hidden="true"></i>reply</span>
                </div>
                <div class="comment-body">
                    {{ comment.body }}
                </div>
            </div>
            <textarea class="comment-textarea" ref="text"></textarea>
            <button type="button" @click="addComment">Save</button>
        </div>
    `,

    props: ['post'],
    
    computed: {
        comments() {
            if (this.post.post_id in storage.state.comments) {
                return storage.state.comments[this.post.post_id]
            }
        }
    },

    filters: {
        fromNow: (value) => {
            return moment(value, 'x').fromNow()
        }
    },

    methods: {
        addComment() {
            poster.addComment(this.post.post_id, this.$refs.text.value)
            this.$refs.text.value = ''
        },

        reply(id) {
            this.$refs.text.value += this.cropIdProvider(id) + ", "
        },
        
        userTitle(comment) {
            return comment.cert_user_id + ': ' + comment.directory.replace('users/', '')
        },

        cropIdProvider(id) {
            return id.split('@')[0]
        }
    }
})
