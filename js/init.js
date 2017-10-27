const poster = new Poster()
const bus = new Vue()
new Vue({
    el: '#root',
    template: `
        <div>
            <top></top>
            <div class="container">
                <newpost></newpost>
                <posts></posts>
            </div>
        </div>
    `,

    mounted() {
        storage.commit('loadURL')
        storage.commit('loadSiteInfo')
        storage.commit('loadLikes')
        storage.commit('loadComments')
        storage.commit('loadPosts')
    }
})
