'use strict'

Vue.component('post', {
    template: `
        <div class="columns" :class="{'isCropped': !isFullPost}" ref="post">
            <div class="column is-narrow" v-if="ownAndMainPage">
                <i class="fa pointer fa-pencil" @click="edit(post)"></i>
                <i class="fa pointer fa-trash-o" @click="del(post.post_id)"></i>
            </div>
            <div class="column post-body" v-html="post.body"></div>
            <div class="column has-text-centered is-hidden-tablet" v-if="!isFullPost">
                <a @click="showFullPost">Show full post...</a>
            </div>
            <div class="column is-3 post-comments">
                <likes :post="post" ></likes>
                <comments :post="post"></comments>
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
        if (this.$refs.post.clientHeight > 1000) {
            this.isFullPost = false
        }
    },

    methods: {
        showFullPost() {
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
            storage.commit('setPosteditor', {'post_id': post.post_id, 'body': post.body})
            scroll(0, 0)
        }
    }
})
