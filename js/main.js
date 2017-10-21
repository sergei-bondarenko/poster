class Page extends ZeroFrame {
    onRequest(cmd, message) {
        bus.$emit('update', cmd, message)
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
        page.cmdp('siteInfo', []).then((site_info) => {
            this.own = site_info.settings.own
        })

        bus.$on('update', (cmd, message) => {
            if (cmd == 'setSiteInfo') {
                if (message.params.event[0] == 'owned') {
                    this.own = message.params.event[1]
                }
            }
        })
    }
})
