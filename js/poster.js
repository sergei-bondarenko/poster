class Poster extends ZeroFrame {
    constructor(url) {
        super(url)
        this.site_info = null
    }

    get isCertSelected() {
        if (storage.state.site_info.cert_user_id == null) {
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

    findPostById(posts, id) {
        // Find an index of the post in the array by its id
        let index = 0
        while (index < posts.length) {
            if (posts[index].post_id == id) {
                break
            }
            index++
        }
        return index
    }

    findCommentById(comments, id) {
        // Find an index of the comment in the array by its id
        let index = 0
        while (index < comments.length) {
            if (comments[index].comment_id == id) {
                break
            }
            index++
        }
        return index
    }

    writePublish(inner_path, data) {
        let json_raw = unescape(encodeURIComponent(JSON.stringify(data, undefined, '    ')))
        this.cmdp('fileWrite', [inner_path, btoa(json_raw)]).then(() => {
            if (inner_path == 'data/data.json') {
                return this.cmdp('sitePublish', ['stored'])
            } else {
                return this.cmdp('sitePublish', [undefined, inner_path])
            }
        }).catch((err) => { console.log('Error: ' + err) })
    }

    async getUserDataJson() {
        return await this.cmdp('fileGet', ['data/users/' + storage.state.site_info.auth_address + '/data.json'])
    }

    async getRootDataJson() {
        return await this.cmdp('fileGet', ['data/data.json'])
    }

    async sqlQuery(query) {
        return await this.cmdp('dbQuery', [query])
    }

    async getSiteInfo() {
        return await this.cmdp('siteInfo', [])
    }

    async like(post_id) {
        if (this.isCertSelected) {
            let data = await this.getUserDataJson()
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

    async saveComment(post_id, text, comment_id) {
        if (this.isCertSelected) {
            let data = await this.getUserDataJson()
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

            if (comment_id == undefined) {
                // Append a new comment
                data.comment.push({
                    'comment_id': data.next_comment_id,
                    'body': text,
                    'post_id': post_id,
                    'date_added': + new Date()
                })
                data.next_comment_id += 1
            } else {
                data.comment[this.findCommentById(data.comment, comment_id)].body = text
            } 

            await this.writePublish('data/users/' + storage.state.site_info.auth_address + '/data.json', data)
            storage.commit('loadComments')
        }
    }

    async savePost(text) {
        text = text.replace(/(?:\r\n|\r|\n)/g, '<br>')
        let data = await this.getRootDataJson()
        let id = storage.state.posteditor.post_id
        data = JSON.parse(data)
        if (id == null) {
            // Append a new post
            data.post.push({
                'post_id': data.next_post_id,
                'date_published': + new Date(),
                'body': text
            })
            data.next_post_id += 1
        } else {
            data.post[this.findPostById(data.post, id)].body = text
        }

        await this.writePublish('data/data.json', data)
        storage.commit('setPosteditor', {'post_id': null, 'body': ''})
        await storage.commit('loadPosts')
        let files = await this.cmdp('fileList', ['uploads/'])
        console.log(files)
    }

    async delPost(id) {
        let data = await this.getRootDataJson()
        data = JSON.parse(data)
        data.post.splice(this.findPostById(data.post, id), 1)
        await this.writePublish('data/data.json', data)
        storage.commit('loadPosts')
    }

    async delComment(id) {
        let data = await this.getUserDataJson()
        data = JSON.parse(data)
        data.comment.splice(this.findCommentById(data.comment, id), 1)
        await this.writePublish('data/users/' + storage.state.site_info.auth_address + '/data.json', data)
        storage.commit('loadComments')
    }

    async uploadFile(file) {
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = () => {
            let base64 = fr.result.split(',')[1]
            poster.cmdp('fileWrite', ['uploads/' + file.name, base64])
        }
    }
}
