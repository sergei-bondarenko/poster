'use strict'

Vue.component('top', {
    template: `
        <div>
            <section class="hero is-warning">
                <div class="hero-body">
                    <div class="container">
                        <a :href="mainPageLink">
                            <p class="title">
                                {{ title }}
                            </p>
                            <p class="subtitle">{{ description }}</p>
                        </a>
                    </div>
                </div>
            </section>
            <div class="container" v-if="mainPageView">
                <div>
                    <a class="button"
                    :class="{'is-success': commentsSelected}"
                    @mouseenter="comments(true)"
                    @mouseout="comments(false)">
                        Last commented
                    </a>
                    <div class="dropdown" :class="{'is-active': showDropdown}">
                        <div class="dropdown-trigger">
                        <a class="button" :class="{'is-success': likesSelected}" aria-haspopup="true"
                        aria-controls="dropdown-menu" ref="dropdown_likes"
                        @mouseover="likes(true)"
                        @mouseout="likes(false)">
                            <span>{{ likesText }}</span>
                            <span class="icon is-small">
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </a>
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
        },

        likesText() {
           if (this.likesSelected == null) {
               return "Most liked"
           } else {
               return "Top " + this.likesSelected
           }
        },

        title() {
            return storage.state.site_title
        },

        description() {
            return storage.state.site_description
        }
    },

    data() {
        return {
            showDropdown: false,
            commentsSelected: false,
            commentsHover: false,
            likesSelected: null,
            likesHover: false
        }
    },

    mounted() {
        window.addEventListener('click', () => {
            if (this.commentsHover == true) {
                if (this.commentsSelected) {
                    this.commentsSelected = false
                    storage.commit('loadPosts')
                } else {
                    this.commentsSelected = true
                    this.likesSelected = null
                    storage.commit('loadPosts', {order: 'comments'})
                }
            }
            if (this.likesHover == true) {
                if (this.showDropdown) {
                    this.showDropdown = false
                    this.likesSelected = null
                    storage.commit('loadPosts')
                } else {
                    this.showDropdown = true
                }
            } else {
                this.showDropdown = false
            }
        })
    },

    methods: {
        likes(state) {
            this.likesHover = state
        },

        comments(state) {
            this.commentsHover = state
        },

        select(elem) {
            this.likesSelected = elem
            this.commentsSelected = false
            storage.commit('loadPosts', {order: 'likes', timespan: elem})
        }
    }
})
