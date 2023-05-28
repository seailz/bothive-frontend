<script>
  import '@material/web/button/filled-button.js'
  import NavRail from './lib/NavRail.svelte';
  import Bots from './pages/Bots.svelte';
  import CreateBot from './pages/CreateBot.svelte';
  import Settings from './pages/Settings.svelte';
  import NavMenu from './lib/NavMenu.svelte';

  var currentlySelected = "Bots"
  function select(name) {
    currentlySelected = name
    console.log(currentlySelected)
  }

  function onFabClick() {
    currentlySelected = "cr_bot"
    console.log(currentlySelected)
  }

  var width = window.innerWidth;
  var height = window.innerHeight;

  function handleResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  window.addEventListener("resize", handleResize);
</script>

{#if width > 1278}
<div class="nav_rail">
  <NavRail onClick={select} onFabClick={onFabClick} />
</div>
{:else}
<div class="nav_menu">
  <NavMenu />
</div>
{/if}
<div class="adjusted_for_rail">
  {#if currentlySelected == "Bots"}
  <Bots />
  {/if}

  {#if currentlySelected == "cr_bot"}
  <CreateBot />
  {/if}

  {#if currentlySelected == "Settings"}
  <Settings />
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
  .adjusted_for_rail {
    margin-left: 100px;
    width: calc(100% - 100px);
    height: 100%;
  }

  @media (max-width: 1278px) {
    .nav_rail {
      display: none;
    }

    .adjusted_for_rail {
      margin-left: 0px;
      width: 100%;
      height: 100%;
    }
  }
</style>