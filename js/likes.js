Vue.component('likes', {
    template: `
        <div>
            <p class="is-size-7"><a :href="url">{{ date_published }}</a></p>
            <i class="fa" :class="{'fa-heart': liked, 'fa-heart-o': !liked}" aria-hidden="true" @click="like()"></i>
            <p>{{ likes }}</p>
        </div>
    `,
    
    props: ['post'],

    computed: {
        likes() {
            if (this.post.post_id in storage.state.likes) {
                return storage.state.likes[this.post.post_id].length
            }
        },

        liked() {
            if (this.post.post_id in storage.state.likes) {
                return storage.state.likes[this.post.post_id]
                    .indexOf(storage.state.site_info.auth_address) != -1
            }
        },

        date_published() {
            return this.post.date_published
        },

        url() {
            return '?post=' + this.post.post_id
        },
    },

    methods: {
        like() {
            poster.like(this.post.post_id)
        }
    }
})
