Vue.component('top', {
    template: `
        <div>
            <section class="hero is-warning">
                <div class="hero-body">
                    <div class="container">
                        <p class="title">
                            Poster
                        </p>
                        <p class="subtitle">
                            Simple blog for zeronet
                        </p>
                    </div>
                </div>
            </section>
            <div class="container">
                <div id="top-posts">
                    <!-- Most liked | Last commented -->
                    <div class="dropdown is-active">
                        <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                            <span>Most liked</span>
                            <span class="icon is-small">
                            <i class="fa fa-angle-down" aria-hidden="true"></i>
                            </span>
                        </button>
                        </div>
                        <div class="dropdown-menu" id="dropdown-menu" role="menu">
                            <div class="dropdown-content">
                                <a href="#" class="dropdown-item">Past day</a>
                                <a href="#" class="dropdown-item">Past week</a>
                                <a href="#" class="dropdown-item">Past month</a>
                                <a href="#" class="dropdown-item">Past year</a>
                                <a href="#" class="dropdown-item">All time</a>
                            </div>
                        </div>
                    </div>
                    <button class="button">Last commented</button>
                </div>
            </div>
        </div>
    `
})
