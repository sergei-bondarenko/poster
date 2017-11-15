'use strict'

Vue.component('posteditor', {
    template: `
        <div class="columns is-centered">
            <div id="column new-post is-half">
                <input type="file" id="input-file"
                    @change="upload" ref="inputFile">
                <nav class="level is-marginless is-mobile">
                    <div class="level-left is-size-6">
                        <i class="level-item fa pointer fa-file-o"
                            @click="initiateUpload()"></i>
                        <i class="level-item fa pointer fa-header"
                            @click="insertTags('h')"></i>
                        <i class="level-item fa pointer fa-paragraph"
                            @click="insertTags('<p></p>')"></i>
                        <i class="level-item fa pointer fa-italic"
                            @click="insertTags('<i></i>')"></i>
                        <i class="level-item fa pointer fa-bold"
                            @click="insertTags('<b></b>')"></i>
                        <i class="level-item fa pointer fa-strikethrough"
                            @click="insertTags('<strike></strike>')"></i>
                        <i class="level-item fa pointer fa-list-ol"
                            @click="insertTags('ol')"></i>
                        <i class="level-item fa pointer fa-list-ul"
                            @click="insertTags('ul')"></i>
                        <i class="level-item fa pointer fa-link"
                            @click="insertTags('a')"></i>
                        <i class="level-item fa pointer fa-code"
                            @click="insertTags('<code></code>')"></i>
                    </div>
                    <div class="level-right">
                        <a class="button" type="button" @click="save">Save</a>
                    </div>
                </nav>
                <textarea class="post-textarea is-size-6"
                    ref="text" v-model="posteditorBody"></textarea>
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

    methods: {
        initiateUpload(type) {
            this.$refs.inputFile.click()
        },

        upload(event) {
            let file = this.$refs.inputFile.files[0]
            poster.uploadFile(file).then((res) => {
                if (res) {
                    this.posteditorBody += this.createLink(file)
                }
            })
        },

        insertTags(tags) {
            if (tags == 'ol') {
                this.posteditorBody += "<ol>\n<li></li>\n<li></li>\n</ol>"
            } else if (tags == 'ul') {
                this.posteditorBody += "<ul>\n<li></li>\n<li></li>\n</ul>"
            } else if (tags == 'h') {
                this.posteditorBody += '<h1 class="title"></h1>'
            } else if (tags == 'a') {
                this.posteditorBody += '<a href="" target="'
                    + Math.floor(Math.random() * 1000000) + '"></a>'
            } else {
                this.posteditorBody += tags
            }
        },

        createLink(file) {
            let type = ''
            let result = ''
            try {
                type = file.type
            } catch(e) {}
            if (type.indexOf('video') != -1) {
                result += '<video controls>\n'
                result += '<source src="uploads/'
                    + file.name + '" type="' + type + '">\n'
                result += '</video>'
            } else if (type.indexOf('audio') != -1) {
                result += '<audio controls>\n'
                result += '<source src="uploads/'
                    + file.name + '" type="' + type + '">\n'
                result += '</audio>'
            } else if (type.indexOf('image') != -1) {
                result += '<a href="uploads/' + file.name
                    + '" target="' + file.name
                    + '"><img src="uploads/' + file.name + '"></a>'
            } else {
                result += '<a href="uploads/' + file.name
                    + '" target="' + file.name + '">'
                    + file.name + '</a>'
            }
            return result
        },

        save() {
            if (this.posteditorBody == '') {
                storage.commit('createModal', {
                    'message': "The post is empty.",
                    'buttonText': 'OK',
                    'action': 'info',
                    'buttonClass': 'is-primary'
                })
            } else {
                poster.savePost(this.posteditorBody)
                storage.commit('setPosteditor', {'body': ''})
            }
        }
    }
})
