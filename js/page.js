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

    checkCert() {
        page.cmdp('siteInfo', []).then((site_info) => {
            this.site_info = site_info
            if (this.site_info.cert_user_id == null) {
                this.cmdp('certSelect', {'accepted_domains': ['zeroid.bit']})
                return Promise.reject("Certificate is not selected")
            } else {
                return this.cmdp('fileGet', ['data/users/' + this.site_info.auth_address + '/data.json'])
            }
        })
    }

    async sqlQuery(query) {
        return await this.cmdp('dbQuery', [query])
    }

    async getAuthAddress() {
        return await this.cmdp('siteInfo', []).auth_address
    }
}
