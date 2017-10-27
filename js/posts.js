Vue.component('posts', {
    template: `
        <div>
            <div v-for="post in posts" class="post">
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

    computed: {
        posts() {
            return storage.state.posts
        }
    }
})
