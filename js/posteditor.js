'use strict'

Vue.component('posteditor', {
    template: `
        <div class="columns is-centered">
            <div id="column new-post is-half">
                <input type="file" id="input-file" @change="upload" ref="inputFile">
                <nav class="level is-marginless is-mobile">
                    <div class="level-left">
                        <i class="level-item is-size-6 fa pointer fa-file-o" @click="initiateUpload()"></i>
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
                        <button class="button is-shadowless" type="button" @click="save">Save</button>
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

    methods: {
        initiateUpload(type) {
            this.$refs.inputFile.click()
        },

        upload(event) {
            let file = this.$refs.inputFile.files[0]
            if ( poster.uploadFile(file) ) {
                this.$refs.text.value += this.createLink(file)
            }
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

        createLink(file) {
            let type = ''
            let result = ''
            try {
                type = file.type
            } catch(e) {}
            if (type.indexOf('video') != -1) {
                result += '<video controls>\n'
                result += '<source src="uploads/' + file.name + '" type="' + type + '">\n'
                result += '</video>'
            } else if (type.indexOf('audio') != -1) {
                result += '<audio controls>\n'
                result += '<source src="uploads/' + file.name + '" type="' + type + '">\n'
                result += '</audio>'
            } else if (type.indexOf('image') != -1) {
                result += '<img src="uploads/' + file.name + '">'
            } else {
                result += '<a href="uploads/' + file.name + '" target="_blanc">' + file.name + '</a>'
            }
            return result
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
                this.$refs.text.value = ''
            }
        }
    }
})
