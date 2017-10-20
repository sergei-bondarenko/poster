Vue.component('newpost', {
    template: `
        <div id="new-post">
            <input type="file" id="input-file" @change="picUpload" ref="inputFile">
            <button type="button" @click="save">Save</button>
            <textarea ref="postarea" id="postarea">
            </textarea>
        </div>
    `,

    methods: {
        picUpload: function (event) {
            let file = this.$refs.inputFile.files[0];
            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                base64 = fr.result.split(',')[1];
                page.cmd('fileWrite', ['uploads/' + file.name, base64], (res) => {
                    if (res == 'ok') {
                        console.log('File uploaded!');
                        this.appendImage(file.name);
                    } else {
                        page.cmd('wrapperNotification',
                            ['error', 'File write error: ' + res]);
                    }
                });
            };
        },

        appendImage: function (name) {
            this.$refs.postarea.value += '![](uploads/' + name + ')';
        },

        save: function () {
            page.cmd('fileGet', ['data/data.json'], (file) => {
                let data = JSON.parse(file);
                data.post.push({
                    'post_id': data.next_post_id,
                    'date_published': + new Date(),
                    'body': this.$refs.postarea.value
                });
                data.next_post_id += 1;
                data = JSON.stringify(data, null, '    ');
                page.cmd('fileWrite', ['data/data.json', btoa(data)], (res) => {
                    if (res == 'ok') {
                        page.cmd('wrapperNotification',
                            ['done', "The new post have been saved. "
                                + "Don't forget to sign and publish!"]);
                        this.$refs.postarea.value = '';
                    } else {
                        page.cmd('wrapperNotification',
                            ['error', 'File write error: ' + res]);
                    }
                });
            });
        }
    }
});
