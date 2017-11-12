'use strict'

Vue.component('comments', {
    template: `
        <div>
            <div :class="{'is-hidden-mobile': isHideCommentsMobile}">
                <hr>
                <div class="comments">
                    <article class="media" v-for="comment in comments">
                        <div class="media-content">
                            <div class="content">
                                <p>
                                    <strong 
                                        :title="userTitle(comment)" 
                                        v-text=
                                        "cropIdProvider(comment.cert_user_id)"
                                    ></strong>

                                    <br>

                                    <div class="isWrapped"
                                        @blur="blur(comment.comment_id)"
                                        :contentEditable=
                                        "comment_id == comment.comment_id"
                                        :ref="'comment' + comment.comment_id"
                                    >{{ comment.body }}</div>
                                    
                                    <br>
                                    
                                    <a class="button is-danger"
                                        @mouseenter="deleteHover(true)"
                                        @mouseout="deleteHover(false)"
                                        v-if="comment_id == comment.comment_id"
                                    >Delete</a>
                                    
                                    <a class="button" 
                                        @mouseenter="saveHover(true)"
                                        @mouseout="saveHover(false)"
                                        v-if="comment_id == comment.comment_id"
                                    >Save</a>

                                    <br v-if=
                                        "comment_id == comment.comment_id">

                                    <br v-if=
                                        "comment_id == comment.comment_id">

                                    <small>
                                        <a @click=
                                            "reply(comment.cert_user_id)"
                                        >Reply</a>
                                        · {{ comment.date_added | fromNow }}
                                    </small>
                                </p>
                            </div>
                        </div>
                        <div class="media-right">
                            <span class="pointer"
                                v-if="own(comment.cert_user_id)"
                                @click="edit(comment)">
                                <i class="fa pointer fa-pencil"></i>
                            </span>
                        </div>
                    </article>
                </div>
                <hr v-if="comments">
                <article class="media">
                    <div class="media-content">
                        <div class="field">
                            <p class="control">
                                <textarea class="textarea"
                                    ref="textarea"
                                    placeholder="Add a comment..."
                                    v-model="newComment"></textarea>
                            </p>
                        </div>
                        <div class="field">
                            <p class="control">
                                <a class="button" @click="save()">
                                    Post comment
                                </a>
                            </p>
                        </div>
                    </div>
                </article>
            </div>
            <div class="has-text-centered is-hidden-tablet"
                v-if="isHideCommentsMobile">
                <a @click="showComments">Show comments...</a>
            </div>
        </div>
    `,

    props: ['post'],

    data() {
        return {
            commentText: '',
            comment_id: undefined,
            isDeleteHover: false,
            isSaveHover: false,
            newComment: '',
            // Hide comments only on a multipost view
            isHideCommentsMobile: storage.state.url == ''
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

    mounted() {
        storage.watch(storage.getters.getModal, () => {
            if (storage.getters.getModal().affirmed == true) {
                if (storage.getters.getModal().action == 'delComment') {
                    if (storage.getters.getModal().id != null) {
                        poster.delComment(storage.getters.getModal().id)
                        storage.commit('destroyModal')
                    }
                } else if (storage.getters.getModal().action == 'info') {
                    storage.commit('destroyModal')
                }
            }
        }, { deep: true })
    },

    methods: {
        showComments() {
            this.isHideCommentsMobile = false
        },

        save(id) {
            if (id == undefined) {
                // A new comment
                if (this.newComment == '') {
                    storage.commit('createModal', {
                        'message': "The comment is empty.",
                        'buttonText': 'OK',
                        'action': 'info',
                        'buttonClass': 'is-primary'
                    })
                } else {
                    poster.saveComment(this.post.post_id, this.newComment, id)
                    this.newComment = ''
                }
            } else {
                // Edited comment
                if (this.$refs['comment' + id][0].innerHTML == '') {
                    storage.commit('createModal', {
                        'message': "The comment is empty.",
                        'action': 'info',
                        'buttonText': 'OK',
                        'buttonClass': 'is-primary'
                    })
                    this.$refs['comment' + id][0].innerHTML = this.commentText
                } else {
                    poster.saveComment(this.post.post_id, 
                        this.$refs['comment' + id][0].innerHTML, id)
                    this.newComment = ''
                }
            }
        },

        reply(id) {
            this.newComment += this.cropIdProvider(id) + ", "
            this.$refs['textarea'].focus()
        },
        
        userTitle(comment) {
            return comment.cert_user_id + ': '
                + comment.directory.replace('users/', '')
        },

        cropIdProvider(id) {
            return id.split('@')[0]
        },

        own(cert) {
            return cert == storage.state.site_info.cert_user_id
        },

        del(id) {
            storage.commit('createModal', {
                'message': "Are you sure to delete this comment?",
                'buttonText': 'Delete',
                'action': 'delComment',
                'buttonClass': 'is-danger',
                'id': id
            })
        },

        edit(comment) {
            this.commentText = comment.body
            this.comment_id = comment.comment_id
            this.$nextTick(() => {
                this.$refs['comment' + comment.comment_id][0].focus()
            })
        },

        deleteHover(state) {
            this.isDeleteHover = state
        },

        saveHover(state) {
            this.isSaveHover = state
        },

        blur(id) {
            if (this.isDeleteHover) {
                // A known bug here. Steps to reproduce:
                // 1. Edit comment
                // 2. Click 'Delete'
                // 3. Close window
                // ...
                // Comment looks like changed
                // You can uncomment the next line:
                //
                //this.$refs['comment' + id][0].innerHTML = this.commentText
                //
                // And this problem will gone
                // But if you:
                // 1. Edit comment
                // 2. Click 'Delete'
                // 3. Click 'Delete' again
                // ...
                // The previous comment will be replaced with current
                //
                // Probably the best solution is to move a comment body editor
                // to a separate component or use a textarea instead of
                // contenteditable div
                this.del(id)
            } else if (this.isSaveHover) {
                this.save(id)
            } else {
                this.$refs['comment' + id][0].innerHTML = this.commentText
            }
            this.isDeleteHover = false
            this.isSaveHover = false
            this.commentText = ''
            this.comment_id = undefined
        }
    }
})
