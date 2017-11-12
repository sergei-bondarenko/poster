'use strict'

Vue.component('post', {
    template: `
        <div>
            <div class="columns">
                <div class="column is-narrow" v-if="ownAndMainPage">
                    <i class="fa pointer fa-pencil"
                        @click="edit(post)"></i>
                    <i class="fa pointer fa-trash-o"
                        @click="del(post.post_id)"></i>
                </div>
                <div class="column"
                    :class="{'isCropped': !isFullPost}"
                    v-html="post.body"
                    ref="postbody"
                ></div>
                <div class="column has-text-centered is-hidden-tablet"
                    v-if="!isFullPost">
                    <a @click="showFullPost">Show full post...</a>
                </div>
                <div class="column is-3">
                    <likes :post="post" ></likes>
                    <comments :post="post"></comments>
                </div>
            </div>
            <div class="has-text-centered is-hidden-mobile" v-if="!isFullPost">
                <a @click="showFullPost">Show full post...</a>
            </div>
        </div>
    `,

    props: ['ownAndMainPage', 'post'],

    data: () => {
        return {
            isFullPost: true
        }
    },

    mounted() {
        this.hideLongPost()
        storage.watch(storage.getters.getPosts, () => {
            // When posts are reloaded, (e.g. clicked 'last comments' button)
            this.hideLongPost()
        })
    },

    methods: {
        hideLongPost() {
            if (storage.state.url == ''
                && this.$refs.postbody.clientHeight > 1000) {
                // Crop long posts only on a multipost view
                this.isFullPost = false
            } else {
                this.isFullPost = true
            }
        },

        showFullPost() {
            this.isFullPost = true
        },

        del(id) {
            storage.commit('createModal', {
                'message': "Are you sure to delete this post?",
                'buttonText': 'Delete',
                'buttonClass': 'is-danger',
                'action': 'delPost',
                'id': id
            })
        },

        edit(post) {
            storage.commit('setPosteditor', {
                'post_id': post.post_id,
                'body': post.body.replace(/<br>/g, '&#13;&#10;')
            })
            scroll(0, 0)
        }
    }
})
