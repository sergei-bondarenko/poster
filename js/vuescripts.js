var app = new Vue({
    el: '#root',
    methods: {
        picUpload: function (event) {
            let file = document.getElementById('input_file').files[0];
            let fr = new FileReader();
            fr.readAsDataURL(file);
            fr.onload = () => {
                base64 = fr.result.split(',')[1];
                page.cmd("fileWrite", ["uploads/" + file.name, base64], (res) => {
                    if (res == "ok") {
                        console.log("File uploaded!");
                    } else {
                        page.cmd("wrapperNotification",
                            ["error", "File write error: " + res]);
                    }
                });
            };
        }
    }
})