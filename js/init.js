const poster = new Poster()
const bus = new Vue()
new Vue({
    el: '#root',
    template: `
        <div>
            <top></top>
            <div class="container">
                <newpost v-if="mainPageView && own"></newpost>
                <hr v-if="mainPageView && own">
                <posts></posts>
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
