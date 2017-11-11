'use strict'

Vue.component('modal', {
    template: `
        <div class="modal" v-bind:class="{ 'is-active': show }">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">Warning</p>
                    <button
                        class="delete"
                        aria-label="close"
                        v-on:click="close()"
                    ></button>
                </header>
                <section class="modal-card-body">
                    {{ message }}
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button"
                        :class="buttonClass"
                        @click="modalAffirmed()"
                    >{{ buttonText }}</button>
                </footer>
            </div>
        </div>
    `,
    
    computed: {
        show() {
            return storage.getters.getModal().show
        },

        message() {
            return storage.getters.getModal().message
        },

        buttonText() {
            return storage.getters.getModal().buttonText
        },

        buttonClass() {
            return storage.getters.getModal().buttonClass
        }
    },

    methods: {
        close() {
            storage.commit('destroyModal')
        },

        modalAffirmed() {
            storage.commit('modalAffirmed')
        }
    }
})
