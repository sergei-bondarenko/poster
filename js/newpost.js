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
                page.cmd("fileWrite", ["uploads/" + file.name, base64], (res) => {
                    if (res == "ok") {
                        console.log("File uploaded!");
                        this.appendImage(file.name);
                    } else {
                        page.cmd("wrapperNotification",
                            ["error", "File write error: " + res]);
                    }
                });
            };
        },

        appendImage: function (name) {
            this.$refs.postarea.value += "![](uploads/" + name + ")";
        },

        save: function () {
            console.log('save');
        }
    }
});
