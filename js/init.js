'use strict'

const poster = new Poster()
const bus = new Vue()
new Vue({
    el: '#root',
    template: `
        <div>
            <modal></modal>
            <top></top>
            <div class="container">
                <posteditor v-if="mainPageView && own"></posteditor>
                <hr class="zigzag" v-if="mainPageView && own">
                <posts :ownAndMainPage="mainPageView && own"></posts>
            </div>
        </div>
    `,

    computed: {
        mainPageView() {
            return storage.state.url == ''
        },

        own() {
            if ("settings" in storage.state.site_info) {
                return storage.state.site_info.settings.own
            }
        }
    },

    mounted() {
        storage.commit('loadURL')
        storage.commit('loadSiteInfo')
        storage.commit('loadLikes')
        storage.commit('loadComments')
        storage.commit('loadPosts')
    }
})
