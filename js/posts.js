Vue.component('posts', {
    template: `
        <div>
            <div v-for="post in posts" class="post">
                <div class="columns">
                    <div class="column is-8 post-body">
                        {{ post.body }}
                    </div>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            comments: [],
            posts: []
        }
    },

    mounted() {
        this.loadPosts()
        bus.$on('update', () => {
            this.loadPosts()
        })
    },

    methods: {
        loadPosts() {
            page.cmdp('dbQuery', ["SELECT * FROM post"]).then((res) => {
                this.posts = []
                res.forEach((post) => {
                    this.posts.push({
                        post_id: post['post_id'],
                        body: post['body'],
                        date_published: post['date_published']
                    })
                })
            })
        }
    }
})

/*
        <div class="post">
            <div class="columns">
                <div class="column is-8 post-body has-text-centered">
                    <img src="uploads/test.png">
                </div>
                <div class="column is-4 post-comments">
                    <div>
                        <i class="fa fa-heart-o" aria-hidden="true"></i>
                        <i class="fa fa-heart" aria-hidden="true"></i>
                        <p>Likes</p>
                        <p class="is-size-7">1 day ago</p>
                    </div>
                    <div class=comment>
                        <div class="comment-info">
                            <span class="comment-username">jwuquan</span>
                            ━
                            <span class="comment-date">on Aug 13, 2017</span>
                        </div>
                        <div class="comment-body">
                            太搞笑了，小孩子太可爱!
                        </div>
                    </div>
                    <div class=comment>
                        <div class="comment-info">
                            <span class="comment-username">jwuquan</span>
                            ━
                            <span class="comment-date">on Aug 13, 2017</span>
                        </div>
                        <div class="comment-body">
                            太搞笑了，小孩子太可爱!
                        </div>
                    </div>
                    <div class=comment>
                        <div class="comment-info">
                            <span class="comment-username">jwuquan</span>
                            ━
                            <span class="comment-date">on Aug 13, 2017</span>
                        </div>
                        <div class="comment-body">
                            太搞笑了，小孩子太可爱!
                        </div>
                    </div>
                    <textarea class="comment-textarea">
                    </textarea>
                </div>
            </div>
        </div>
*/
