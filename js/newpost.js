Vue.component('newpost', {
    template: `
        <div id="new-post" v-if="show">
            <input type="file" id="input-file" @change="picUpload" ref="inputFile">
            <button type="button" @click="save">Save</button>
            <textarea ref="postarea" id="postarea">
            </textarea>
        </div>
    `,

    computed: {
        show() {
            if ("settings" in storage.state.site_info) {
                return storage.state.site_info.settings.own
            } else {
                return false
            }
        }
    },

    methods: {
        picUpload(event) {
            let file = this.$refs.inputFile.files[0]
            let fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = () => {
                base64 = fr.result.split(',')[1]
                poster.cmdp('fileWrite', ['uploads/' + file.name, base64]).then((res) => {
                    if (res == 'ok') {
                        console.log('File uploaded!')
                        this.appendImage(file.name)
                    } else {
                        poster.cmdp('wrapperNotification',
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
            poster.cmdp('fileGet', ['data/data.json']).then((file) => {
                data = JSON.parse(file)
                data.post.push({
                    'post_id': data.next_post_id,
                    'date_published': + new Date(),
                    'body': this.$refs.postarea.value
                })
                data.next_post_id += 1
                poster.writePublish('data/data.json', data)
                this.$refs.postarea.value = ''
            })
        }
    }
})
