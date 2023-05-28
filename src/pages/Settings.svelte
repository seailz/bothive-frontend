<script>
  import { onMount } from "svelte";
  import '@material/web/switch/switch.js'

    export let darkMode = false;
    var container;
    
    onMount(() => {
        requestAnimationFrame(() => {
            container.style.opacity = "1";
            container.style.marginTop = "0px";
        })
    })
</script>

<div class="container" bind:this={container}>
    <div class="header">
        Settings
    </div>

    <p class="sub_header">
        Customize your experience with personalized settings.
    </p>

    <div class="settings">
        <div class="setting">
            
        </div>
    </div>
</div>

<style>
    .sub_header {
        margin-top: 4px;
        font: var(--md-sys-typescale-body-large-font);
        letter-spacing: var(--md-sys-typescale-body-large-letter-spacing);
    }

    .settings {
        margin-top: 64px;
    }

    
    .header {
        font: var(--md-sys-typescale-display-medium-font);
        letter-spacing: var(--md-sys-typescale-display-medium-letter-spacing);
        margin: 0px;
    }

    .container {
        width: calc(95% - 128px);
        height: calc(95% - 128px);
        border-radius: 32px;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--md-sys-color-primary-container);
        padding: 64px;

        /* Animation */
        opacity: 0;
        margin-top: 32px;
        transition: all 0.7s cubic-bezier(0.2, 0.0, 0, 1.0);
    }
</style>
