Vue.component('posts', {
    template: `
        <div>
            <newpost></newpost>
            <div v-for="post in posts" class="post">
                <post :post_id="post.post_id"></post>
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
        bus.$on('update', () => {
            this.load()
        })
    },

    updated() {
        bus.$emit('update_posts')
    },

    methods: {
        load() {
            page.cmdp('dbQuery', ["SELECT post_id FROM post ORDER BY date_published DESC"]).then((res) => {
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
                post_id: null,
                body: null,
                date_published: null
            }
        }
    },

    mounted() {
        this.load()
        bus.$on('update_posts', () => {
            this.load()
        })
    },

    methods: {
        load() {
            page.cmdp('dbQuery', ["SELECT * FROM post WHERE post_id=" + this.post_id]).then((res) => {
                this.post.post_id = res[0].post_id
                this.post.body = res[0].body
                this.post.date_published = res[0].date_published
            })
        }
    }
})
