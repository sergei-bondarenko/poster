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
                    <button class="button">Last commented</button>
                    <div class="dropdown" :class="{'is-active': show_dropdown_likes}" ref="dropdown_likes">
                        <div class="dropdown-trigger">
                        <button class="button" @click="toggleDropdownLikes()" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span>{{ dropdown_likes_text }}</span>
                            <span class="icon is-small">
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a class="dropdown-item" @click="select('day')" :class="{'is-active': selected == 'day'}">Past day</a>
                                <a class="dropdown-item" @click="select('week')" :class="{'is-active': selected == 'week'}">Past week</a>
                                <a class="dropdown-item" @click="select('month')" :class="{'is-active': selected == 'month'}">Past month</a>
                                <a class="dropdown-item" @click="select('year')" :class="{'is-active': selected == 'year'}">Past year</a>
                                <a class="dropdown-item" @click="select('all')" :class="{'is-active': selected == 'all'}">All time</a>
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
            selected: null,
            dropdown_likes_text: "Most liked"
        }
    },

    mounted() {
        window.addEventListener('click', (event) => {
            if ( !event.path.includes(this.$refs.dropdown_likes) ) {
                // User clicks outside of the dropdown menu
                this.show_dropdown_likes = false
            }
        }, true)
    },

    methods: {
        toggleDropdownLikes() {
            this.show_dropdown_likes = !this.show_dropdown_likes
        },

        select(elem) {
            this.selected = elem
            this.dropdown_likes_text = 'Top ' + elem
            this.show_dropdown_likes = false
        }
    }
})
