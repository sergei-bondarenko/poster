Vue.component('posteditor', {
    template: `
        <div class="columns is-centered">
            <div id="column new-post is-half">
                <input type="file" id="input-file" @change="upload" ref="inputFile">
                <nav class="level is-marginless">
                    <div class="level-left">
                        <i class="level-item is-size-6 fa pointer fa-file-image-o" @click="initiateUpload('img')"></i>
                        <i class="level-item is-size-6 fa pointer fa-file-video-o" @click="initiateUpload('video')"></i>
                        <i class="level-item is-size-6 fa pointer fa-file-audio-o" @click="initiateUpload('audio')"></i>
                        <i class="level-item is-size-6 fa pointer fa-file-o" @click="initiateUpload('file')"></i>
                        <i class="level-item is-size-6 fa pointer fa-header" @click="insertTags('<h1></h1>')"></i>
                        <i class="level-item is-size-6 fa pointer fa-paragraph" @click="insertTags('<p></p>')"></i>
                        <i class="level-item is-size-6 fa pointer fa-italic" @click="insertTags('<i></i>')"></i>
                        <i class="level-item is-size-6 fa pointer fa-bold" @click="insertTags('<b></b>')"></i>
                        <i class="level-item is-size-6 fa pointer fa-strikethrough" @click="insertTags('<strike></strike>')"></i>
                        <i class="level-item is-size-6 fa pointer fa-list-ol" @click="insertTags('ol')"></i>
                        <i class="level-item is-size-6 fa pointer fa-list-ul" @click="insertTags('ul')"></i>
                        <i class="level-item is-size-6 fa pointer fa-external-link" @click="insertTags('a')"></i>
                        <i class="level-item is-size-6 fa pointer fa-code" @click="insertTags('<code></code>')"></i>
                    </div>
                    <div class="level-right">
                        <button class="level-item button is-shadowless" type="button" @click="save">Save</button>
                    </div>
                </nav>
                <textarea class="post-textarea is-size-6" ref="text" v-model="posteditorBody"></textarea>
            </div>
        </div>
    `,

    computed: {
        posteditorBody: {
            get() {
                return storage.state.posteditor.body
            },
            set(value) {
                return storage.commit('setPosteditor', {'body': value})
            }
        }
    },

    mounted() {
        storage.watch(storage.getters.getModal, () => {
            if (storage.getters.getModal().affirmed == true
                && storage.getters.getModal().action == 'info') {
                storage.commit('destroyModal')
            }
        }, { deep: true })
    },

    data() {
        return {
            filename: null,
            filetype: null
        }
    },

    methods: {
        initiateUpload(type) {
            this.filetype = type
            this.$refs.inputFile.click()
        },

        upload(event) {
            let file = this.$refs.inputFile.files[0]
            if ( this.getMediaType(file.name, this.filetype) ) {
                poster.uploadFile(file)
                this.filename = file.name
                this.createLink()
            } else {
                if ( this.filetype == 'video' ) {
                    storage.commit('createModal', {
                        'message': "Legitimate video extensions are .mp4, .ogg and .webm",
                        'buttonText': 'OK',
                        'action': 'info',
                        'buttonClass': 'is-primary'
                    })
                } else if ( this.filetype == 'audio' ) {
                    storage.commit('createModal', {
                        'message': "Legitimate audio extensions are .mp3, .ogg and .wav",
                        'buttonText': 'OK',
                        'action': 'info',
                        'buttonClass': 'is-primary'
                    })
                }
            }
        },

        createLink() {
            let type = this.getMediaType(this.filename, this.filetype)
            if (this.filetype == 'img') {
                this.$refs.text.value += '<img src="uploads/' + this.filename + '">'
            } else if (this.filetype == 'video') {
                this.$refs.text.value += '<video width="320" height="240" controls>\n'
                this.$refs.text.value += '<source src="uploads/' + this.filename + '" type="' + type + '">\n'
                this.$refs.text.value += '</video>'
            } else if (this.filetype == 'audio') {
                this.$refs.text.value += '<audio controls>\n'
                this.$refs.text.value += '<source src="uploads/' + this.filename + '" type="' + type + '">\n'
                this.$refs.text.value += '</audio>'
            } else if (this.filetype == 'file') {
                this.$refs.text.value += '<a href="uploads/' + this.filename + '" target="_blanc">' + this.filename + '</a>'
            }
            this.filename = null
            this.filetype = null
        },

        insertTags(tags) {
            if (tags == 'ol') {
                this.$refs.text.value += "<ol>\n<li></li>\n<li></li>\n</ol>"
            } else if (tags == 'ul') {
                this.$refs.text.value += "<ul>\n<li></li>\n<li></li>\n</ul>"
            } else if (tags == 'a') {
                this.$refs.text.value += '<a href=""></a>'
            } else {
                this.$refs.text.value += tags
            }
        },

        save() {
            if (this.$refs.text.value == '') {
                storage.commit('createModal', {
                    'message': "The post is empty.",
                    'buttonText': 'OK',
                    'action': 'info',
                    'buttonClass': 'is-primary'
                })
            } else {
                poster.savePost(this.$refs.text.value)
            }
        },

        getMediaType(filename, filetype) {
            if (filetype == 'video') {
                if (filename.toLowerCase().endsWith('mp4')) return 'video/mp4'
                if (filename.toLowerCase().endsWith('webm')) return 'video/webm'
                if (filename.toLowerCase().endsWith('ogg')) return 'video/ogg'
            } else if (filetype == 'audio') {
                if (filename.toLowerCase().endsWith('mp3')) return 'audio/mpeg'
                if (filename.toLowerCase().endsWith('ogg')) return 'audio/ogg'
                if (filename.toLowerCase().endsWith('wav')) return 'audio/wav'
            } else if (filetype == 'img' || filetype == 'file') return true
        }
    }
})
