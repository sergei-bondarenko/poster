class Page extends ZeroFrame {
    onOpenWebsocket() {
        bus.$emit('websocket_ready')
    }
}

let page = new Page()
let bus = new Vue()
let app = new Vue({
    el: '#root',
    data() {
        return {
            own: false,
        }
    },
    mounted() {
        bus.$on('websocket_ready', () => {
            page.cmdp('siteInfo', []).then((site_info) => {
                this.own = site_info.settings.own
            })
        })
    }
})
