const page = new Page()
const bus = new Vue()
new Vue({
    el: '#root',
    template: `
        <div>
            <top></top>
            <div class="container">
                <posts></posts>
            </div>
        </div>
    `,

    mounted() {
        storage.commit('loadSiteInfo')
        storage.commit('loadData')
    }
})
