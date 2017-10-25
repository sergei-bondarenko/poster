const page = new Page()
const bus = new Vue()
new Vue({
    el: '#root',
    template: `
        <div>
            <top></top>
            <div class="container">
                <posts v-if="post_id == ''"></posts>
                <post v-if="post_id != ''" :post_id="post_id"></post>
            </div>
        </div>
    `,

    mounted() {
        storage.commit('updateUrl')
        storage.dispatch('loadPosts')
    }
})
