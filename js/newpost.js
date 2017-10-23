Vue.component('newpost', {
    template: `
        <div id="new-post" v-if="own">
            <input type="file" id="input-file" @change="picUpload" ref="inputFile">
            <button type="button" @click="save">Save</button>
            <textarea ref="postarea" id="postarea">
            </textarea>
        </div>
    `,

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
    },

    methods: {
        picUpload(event) {
            let file = this.$refs.inputFile.files[0]
            let fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = () => {
                base64 = fr.result.split(',')[1]
                page.cmdp('fileWrite', ['uploads/' + file.name, base64]).then((res) => {
                    if (res == 'ok') {
                        console.log('File uploaded!')
                        this.appendImage(file.name)
                    } else {
                        page.cmdp('wrapperNotification',
                            ['error', "File write error: " + res])
                    }
                })
            }
        },

        appendImage(name) {
            this.$refs.postarea.value += '![](uploads/' + name + ')'
        },

        save() {
            let data = null
            page.cmdp('fileGet', ['data/data.json']).then((file) => {
                data = JSON.parse(file)
                data.post.push({
                    'post_id': data.next_post_id,
                    'date_published': + new Date(),
                    'body': this.$refs.postarea.value
                })
                data.next_post_id += 1
                page.writePublish('data/data.json', data)
                this.$refs.postarea.value = ''
            })
        }
    }
})
