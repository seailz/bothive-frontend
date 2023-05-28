<script>
    import '@material/web/fab/fab.js'
    import '@material/web/icon/icon.js'
    import { onMount } from 'svelte';
    export let items = [
        {
            "name": "Bots",
            "icon": "smart_toy",
            "href": "/bots",
            "active": true
        },
        {
            "name": "Settings",
            "icon": "settings",
            "href": "/settings",
            "active": false
        }
    ]

    // @ts-ignore
    export let onClick = (i) => { }
    export let includeFab = true
    export let onFabClick = () => { }

    onMount(() => {
        items.forEach(i => {
            if (i.active) {
                // @ts-ignore
                document.querySelector("#" + i.name + " .active_indicator").style.width = "56px";
            }
        })
    });

    function onItemClick(name) {
        onClick(name)
        items.forEach((item) => {
            if (item.name == name) {
                item.active = true
            } else {
                item.active = false
            }
        })
        items = items

        var activeIndicator = document.querySelector("#" + name + " .active_indicator")
        // @ts-ignore
        activeIndicator.style.width = "30px";
        requestAnimationFrame(() => {
            // @ts-ignore
            activeIndicator.style.width = "56px";
        })
    }

    function deselectAll() {
        items.forEach((item) => {
            item.active = false
        })
        items = items
    }
</script>

<div class="rail">
    <div class="fab">
        {#if includeFab}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <md-fab on:click={() => {onFabClick(); deselectAll()}} class="md-fab">
            <md-icon slot="icon">add</md-icon>
        </md-fab>
    {/if}
    </div>
    <div class="items">
        {#each items as item}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div id="{item.name}" class="item" on:click={() => { onItemClick(item.name);}}>
                <div class="active_indicator" style="{item.active ? "background-color: var(--md-sys-color-secondary-container);" : ""}"></div>
                <div class="item_content">
                    <md-icon class="icon">{item.icon}</md-icon>
                    <p class="title">
                        {item.name}
                    </p>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .md-fab {
        cursor: pointer;
    }
    .fab {
        position: absolute;
        top: 8%;
        left: 50%;
        transform: translate(-50%, -50%);
        cursor: pointer;
    }

    .item:hover .active_indicator {
        background-color: rgba(128, 128, 128, 0.173);
    }

    .item:active .active_indicator {
        background-color: rgba(128, 128, 128, 0.36);
    }

    .rail {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 80px;
        padding-left: 12px;
        padding-right: 12px;
        background-color: var(--md-sys-color-surface);
    }

    .icon {
        margin: 0px;
        z-index: 100;
    }

    .title {
        margin: 0px;
        font: var(--md-sys-typescale-label-medium-font);
        letter-spacing: var(--md-sys-typescale-label-medium-letter-spacing);
        margin-top: 4px;
    }

    .item {
        margin-bottom: 12px;
        height: 56px;
        width: 56px;
        user-select: none;
        cursor: pointer;
    }

    .active_indicator {
        width: 30px;
        height: 32px;
        position: relative;
        top: 80%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
        z-index: -100;
        transition: all 0.3s cubic-bezier(0, 0, 0, 1);;
    }
    
    .items {
        position: absolute;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    .item_content {
        text-align: center;
    }
</style>