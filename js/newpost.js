Vue.component('newpost', {
    template: `
        <div id="new-post" v-if="show">
            <input type="file" id="input-file" @change="addPicture" ref="inputFile">
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
        addPicture(event) {
            let file = this.$refs.inputFile.files[0]
            poster.uploadFile(file)
            this.$refs.text.value += '![](uploads/' + file.name + ')'
        },

        addPost() {
            poster.addPost(this.$refs.text.value)
            this.$refs.text.value = ''
        }
    }
})
