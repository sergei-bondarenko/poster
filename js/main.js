class Page extends ZeroFrame {
    constructor(url) {
        super(url)
        this.site_info = null
    }

    onRequest(cmd, message) {
        bus.$emit('update', cmd, message)
    }

    writePublish(inner_path, data) {
        let json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '    ')))
        page.cmdp('fileWrite', [inner_path, btoa(json_raw)]).then(() => {
            bus.$emit('update')
            if (inner_path == 'data/data.json') {
                return page.cmdp('sitePublish', ['stored'])
            } else {
                return page.cmdp('sitePublish', [undefined, inner_path])
            }
        })
    }
}

let bus = new Vue()
let page = new Page()
let app = new Vue({
    el: '#root',
    data() {
        return {
            own: false,
        }
    },
    mounted() {
        page.cmdp('siteInfo', []).then((site_info) => {
            page.site_info = site_info
            this.own = page.site_info.settings.own
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

