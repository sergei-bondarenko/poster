Vue.component('comments', {
    template: `
        <div>
            <div v-for="comment in comments" class="comment">
                <div class="comment-info">
                    <span class="comment-username">{{ comment.cert_user_id }}</span>
                    ━
                    <span class="comment-date">{{ comment.date_added }}</span>
                </div>
                <div class="comment-body">
                    {{ comment.body }}
                </div>
            </div>
            <textarea class="comment-textarea" ref="text"></textarea>
            <button type="button" @click="comment()">Save</button>
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

    methods: {
        comment() {
            poster.comment(this.post.post_id, this.$refs.text.value)
            this.$refs.text.value = ''
        }
    }
})
