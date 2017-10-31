Vue.component('comments', {
    template: `
        <div>
            <div v-for="comment in comments" class="comment">
                <div class="comment-info">
                    <span class="comment-username" :title="userTitle(comment)" v-text="cropIdProvider(comment.cert_user_id)"></span>
                    ━
                    <span class="comment-date">{{ comment.date_added | fromNow }}</span>
                    <span class="pointer" @click="reply(comment.cert_user_id)"><i class="fa fa-reply" aria-hidden="true"></i>reply</span>
                    <span class="pointer" v-if="own(comment.cert_user_id)" @click="edit(comment)"><i class="fa pointer fa-pencil"></i></span>
                    <span class="pointer" v-if="own(comment.cert_user_id)" @click="del(comment.comment_id)"><i class="fa pointer fa-trash-o"></i></span>
                </div>
                <div class="comment-body">
                    {{ comment.body }}
                </div>
            </div>
            <textarea class="comment-textarea" v-model="commentText"></textarea>
            <button type="button" @click="save">Save</button>
        </div>
    `,

    props: ['post'],

    data() {
        return {
            commentText: '',
            comment_id: null
        }
    },

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
        save() {
            poster.saveComment(this.post.post_id, this.commentText, this.comment_id)
            this.commentText = ''
            this.comment_id = null
        },

        reply(id) {
            this.commentText += this.cropIdProvider(id) + ", "
        },
        
        userTitle(comment) {
            return comment.cert_user_id + ': ' + comment.directory.replace('users/', '')
        },

        cropIdProvider(id) {
            return id.split('@')[0]
        },

        own(cert) {
            return cert == storage.state.site_info.cert_user_id
        },

        del(id) {
            poster.delComment(id)
        },

        edit(comment) {
            this.commentText = comment.body
            this.comment_id = comment.comment_id
        }
    }
})
