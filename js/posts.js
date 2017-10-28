Vue.component('posts', {
    template: `
        <div>
            <div v-for="(post, index) in posts" class="post" :ref="'post'+index">
                <div class="columns">
                    <div class="column is-8 post-body">
                        {{ post.body }}
                    </div>
                    <div class="column is-4 post-comments">
                        <likes :post="post" ></likes>
                        <comments :post="post"></comments>
                    </div>
                </div>
                <hr>
            </div>
        </div>
    `,

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
    },

    methods: {
        scroll() {
            let current_position = window.scrollY
            let trigger_position = this.$refs['post' + (this.post_count-10)][0].offsetTop
            if (current_position > trigger_position) {
                this.post_count += 15
            }
        }
    }
})
