'use strict'

Vue.component('posts', {
    template: `
        <div>
            <div v-if="posts.length == 0">
                <div class="columns">
                    <div class="column">
                        No posts.
                    </div>
                </div>
            </div>
            <div v-for="(post, index) in posts"
                class="post"
                :ref="'post'+index">
                <post :ownAndMainPage="ownAndMainPage" :post="post"></post>
                <hr class="zigzag" v-if="index != posts.length-1">
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
            if (this.post_count > 10
                && this.post_count < storage.state.posts.length) {
                let current_position = window.scrollY
                let trigger_post = 'post' + (this.post_count - 10)
                let trigger_position = this.$refs[trigger_post][0].offsetTop
                if (current_position > trigger_position) {
                    this.post_count += 15
                }
            }
        }
    }
})
