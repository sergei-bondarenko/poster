'use strict'

Vue.component('post', {
    template: `
        <div class="columns" ref="post">
            <div>
                <i class="fa pointer fa-pencil" v-if="ownAndMainPage" @click="edit(post)"></i>
                <i class="fa pointer fa-trash-o" v-if="ownAndMainPage" @click="del(post.post_id)"></i>
            </div>
            <div class="column is-8 post-body" v-html="post.body"></div>
            <div class="column has-text-centered is-hidden-tablet">
                <a @click="showFullPost" v-if="!isFullPost">Show full post...</a>
            </div>
            <div class="column is-4 post-comments">
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
