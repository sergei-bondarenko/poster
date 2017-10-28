Vue.component('newpost', {
    template: `
        <div id="new-post" v-if="show">
            <input type="file" id="input-file" @change="picUpload" ref="inputFile">
            <button type="button" @click="addPost()">Save</button>
            <textarea ref="text">
            </textarea>
        </div>
    `,

    computed: {
        show() {
            if ("settings" in storage.state.site_info) {
                return storage.state.site_info.settings.own
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
            this.$refs.text.value += '![](uploads/' + name + ')'
        },

        addPost() {
            poster.addPost(this.$refs.text.value)
            this.$refs.text.value = ''
        }
    }
})
