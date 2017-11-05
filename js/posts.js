'use strict'

Vue.component('posts', {
    template: `
        <div>
            <div v-if="posts.length == 0">No posts.</div>
            <div v-for="(post, index) in posts" class="post" :ref="'post'+index">
                <div class="columns">
                    <div>
                        <i class="fa pointer fa-pencil" v-if="ownAndMainPage" @click="edit(post)"></i>
                        <i class="fa pointer fa-trash-o" v-if="ownAndMainPage" @click="del(post.post_id)"></i>
                    </div>
                    <div class="column is-8 post-body" v-html="post.body"></div>
                    <div class="column is-4 post-comments">
                        <likes :post="post" ></likes>
                        <comments :post="post"></comments>
                    </div>
                </div>
                <hr v-if="index != posts.length-1">
            </div>
        </div>
    `,

    props: ['ownAndMainPage'],

    data: () => {
        return {
            post_count: 15
        }
    },

    computed: {
        posts() {
            return storage.state.posts.slice(0, this.post_count)
        }
    },

    mounted() {
        window.addEventListener('scroll', this.scroll)
        storage.watch(storage.getters.getModal, () => {
            if (storage.getters.getModal().action == 'delPost'
                && storage.getters.getModal().affirmed == true) {
                poster.delPost(storage.getters.getModal().id)
                storage.commit('destroyModal')
            }
        }, { deep: true })
    },

    methods: {
        scroll() {
            if (this.post_count > 10 && this.post_count < storage.state.posts.length) {
                let current_position = window.scrollY
                let trigger_position = this.$refs['post' + (this.post_count-10)][0].offsetTop
                if (current_position > trigger_position) {
                    this.post_count += 15
                }
            }
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
