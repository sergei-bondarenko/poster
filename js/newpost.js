Vue.component('newpost', {
    template: `
        <div id="new-post">
            <input type="file" id="input-file" @change="addPicture" ref="inputFile">
            <button type="button" @click="addPost()">Save</button>
            <textarea ref="text">
            </textarea>
        </div>
    `,

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
