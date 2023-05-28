<script>
    export let items = [
        {
            name: "Bots",
            icon: "smart-toy",
            selected: false
        }
    ]
    export let open = false;
    
    function close() {
        requestAnimationFrame(() => {
            open = false;
            document.getElementById("scrim").style.opacity = "0";
            document.getElementById("nav").style.transform = "translateX(-360px)";
            sleep(700).then(() => {
                document.getElementById("scrim").style.display = "none";
                document.getElementById("nav").style.display = "none";
            })
        })
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="scrim" class="scrim" on:click={close}></div>

<div id="nav" class="nav_menu">
    <p>Bothive</p>
</div>

<style>
    .nav_menu p {
        color: var(--md-sys-color-on-surface-variant);
        font: var(--md-sys-typescale-title-small-font);
        letter-spacing: var(--md-sys-typescale-title-small-letter-spacing);
        margin: 28px 0 28px 28px;
    }

    .nav_menu {
        width: 360px;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
        background-color: var(--md-sys-color-surface-container-low);
        border-radius: 0px 16px 16px 0px;
        transition: all 700ms cubic-bezier(0.05, 0.7, 0.1, 1.0);
        display: none;
    }

    .scrim {
        width: 100vw;
        height: 100vh;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        background-color: black;
        opacity: 36%;
        transition: all 400ms cubic-bezier(0.05, 0.7, 0.1, 1.0);
        display: none;
    }
</style>