let page = new ZeroFrame();

var app = new Vue({
    el: '#root',
    data() {
        return {
            own: false,
        }
    },
    mounted() {
        page.cmdp('siteInfo', []).then((site_info) => {
            this.own = site_info.settings.own;
        });
    }
})
