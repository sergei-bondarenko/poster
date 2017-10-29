Vue.component('top', {
    template: `
        <div>
            <section class="hero is-warning">
                <div class="hero-body">
                    <div class="container">
                        <p class="title">
                            <a :href="mainPageLink">Poster</a>
                        </p>
                        <p class="subtitle">
                            Simple blog for zeronet
                        </p>
                    </div>
                </div>
            </section>
            <div class="container" v-if="mainPageView">
                <div id="top-posts">
                    <button class="button" @click="toggleDropdownComments()" :class="{'is-success': commentsSelected}">Last commented</button>
                    <div class="dropdown" :class="{'is-active': show_dropdown_likes}">
                        <div class="dropdown-trigger">
                        <button class="button" :class="{'is-success': likesSelected}"
                                @click="toggleDropdownLikes()" aria-haspopup="true"
                                aria-controls="dropdown-menu" ref="dropdown_likes">
                            <span>{{ dropdown_likes_text }}</span>
                            <span class="icon is-small">
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a class="dropdown-item" @click="select('day')" :class="{'is-active': likesSelected == 'day'}">Past day</a>
                                <a class="dropdown-item" @click="select('week')" :class="{'is-active': likesSelected == 'week'}">Past week</a>
                                <a class="dropdown-item" @click="select('month')" :class="{'is-active': likesSelected == 'month'}">Past month</a>
                                <a class="dropdown-item" @click="select('year')" :class="{'is-active': likesSelected == 'year'}">Past year</a>
                                <a class="dropdown-item" @click="select('all')" :class="{'is-active': likesSelected == 'all'}">All time</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    computed: {
        mainPageView() {
            return storage.state.url == ''
        },

        mainPageLink() {
            return window.location.origin + window.location.pathname
        }
    },

    data() {
        return {
            show_dropdown_likes: false,
            likesSelected: null,
            commentsSelected: false,
            dropdown_likes_text: "Most liked"
        }
    },

    mounted() {
        window.addEventListener('click', (event) => {
            if (event.target != this.$refs.dropdown_likes) {
                // User clicks outside of the dropdown menu
                this.show_dropdown_likes = false
            }
        }, true)
    },

    methods: {
        toggleDropdownLikes() {
            this.dropdown_likes_text = "Most liked"
            this.likesSelected = null
            this.show_dropdown_likes = !this.show_dropdown_likes
        },

        select(elem) {
            this.likesSelected = elem
            this.dropdown_likes_text = 'Top ' + elem
            this.show_dropdown_likes = false
            this.commentsSelected = false
        },

        toggleDropdownComments() {
            this.commentsSelected = !this.commentsSelected
            this.likesSelected = null
            this.dropdown_likes_text = "Most liked"
        }
    }
})
