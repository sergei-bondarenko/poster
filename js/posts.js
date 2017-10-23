Vue.component('posts', {
    template: `
        <div>
            <div v-for="post in posts" class="post">
                <post :post_id="post['post_id']"></post>
                <hr>
            </div>
        </div>
    `,

    data() {
        return {
            posts: []
        }
    },

    mounted() {
        this.load()
        bus.$on('update', () => {
            this.load()
        })
    },

    methods: {
        load() {
            page.cmdp('dbQuery', ["SELECT post_id FROM post"]).then((res) => {
                this.posts = res
            })
        }
    }
})

Vue.component('post', {
    template: `
        <div class="columns">
            <div class="column is-8 post-body">
                {{ post.body }}
            </div>
            <div class="column is-4 post-comments">
                <likes :post_id="post.post_id" :date_published="post.date_published"></likes>
                <comments :post_id="post.post_id"></comments>
            </div>
        </div>
    `,

    props: ['post_id'],

    data() {
        return {
            post: {
                post_id: this.post_id,
                body: null,
                date_published: null
            }
        }
    },

    mounted() {
        this.load()
        bus.$on('update', () => {
            this.load()
        })
    },

    methods: {
        load() {
            page.cmdp('dbQuery', ["SELECT * FROM post WHERE post_id=" + this.post_id]).then((res) => {
                this.post = res[0]
            })
        }
    }
})
