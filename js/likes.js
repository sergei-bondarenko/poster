'use strict'

Vue.component('likes', {
    template: `
        <div>
            <div class="is-hidden-mobile">
                <p class="is-size-7">
                    <a :href="url">{{ date_published }}</a>
                </p>
                <span class="pointer" @click="like()">
                    <i class="fa" :class="likedClass"
                        aria-hidden="true"></i>
                    <span>{{ likes }}</span>
                </span>
            </div>
            <div class="is-hidden-tablet">
                <nav class="level is-mobile">
                    <div class="level-left">
                        <div class="level-item">
                            <p class="is-size-7">
                                <a :href="url">{{ date_published }}</a>
                            </p>
                        </div>
                    </div>
                    <div class="level-right">
                        <div class="level-item">
                            <span class="pointer" @click="like()">
                                <i class="fa" :class="likedClass"
                                    aria-hidden="true"></i>
                                <span>{{ likes }}</span>
                            </span>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    `,
    
    props: ['post'],

    computed: {
        likes() {
            if (this.post.post_id in storage.state.likes) {
                return storage.state.likes[this.post.post_id].length
            }
        },

        date_published() {
            return moment(this.post.date_published, 'x').fromNow()
        },

        url() {
            return '?post=' + this.post.post_id
        },

        likedClass() {
            let liked = false
            if (this.post.post_id in storage.state.likes) {
                liked = storage.state.likes[this.post.post_id]
                    .indexOf(storage.state.site_info.auth_address) != -1
            }
            if (liked) {
                return 'fa-heart'
            } else {
                return 'fa-heart-o'
            }
        }
    },

    methods: {
        like() {
            poster.like(this.post.post_id)
        }
    }
})
