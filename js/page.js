class Page extends ZeroFrame {
    constructor(url) {
        super(url)
        this.site_info = null
    }

    get isCertSelected() {
        if (this.site_info.cert_user_id == null) {
            this.cmdp('certSelect', {'accepted_domains': ['zeroid.bit']})
            return false
        } else {
            return true
        }
    }

    onRequest(cmd, message) {
        if (cmd == 'setSiteInfo') {
            storage.commit('loadSiteInfo')
        }
    }

    writePublish(inner_path, data) {
        let json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '    ')))
        page.cmdp('fileWrite', [inner_path, btoa(json_raw)]).then(() => {
            if (inner_path == 'data/data.json') {
                return page.cmdp('sitePublish', ['stored'])
            } else {
                return page.cmdp('sitePublish', [undefined, inner_path])
            }
        })
    }

    async getDataJson() {
        return await this.cmdp('fileGet', ['data/users/' + storage.state.site_info.auth_address + '/data.json'])
    }

    async like(post_id) {
        if (this.isCertSelected) {
            let data = await this.getDataJson()
            if (data) {
                data = JSON.parse(data)
            } else {
                data = {
                    'next_comment_id': 1,
                    'comment': [],
                    'comment_vote': {},
                    'post_vote': {}
                }
            }

            if (post_id in data.post_vote) {
                delete data.post_vote[post_id]
            } else {
                data.post_vote[post_id] = 1
            }
            await this.writePublish('data/users/' + storage.state.site_info.auth_address + '/data.json', data)
            storage.commit('loadLikes')
        }
    }

    async sqlQuery(query) {
        return await this.cmdp('dbQuery', [query])
    }

    async getSiteInfo() {
        return await this.cmdp('siteInfo', [])
    }
}
