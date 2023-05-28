<script>
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { fb } from '../main.js'
    import '@material/web/icon/icon.js'
    import '@material/web/button/tonal-button.js'
  // @ts-ignore
  import { afterUpdate, onMount } from 'svelte';
    export let loaded = false;

    let bots = [];
    let allBots = [];
    let consoleMessages = []
    const auth = getAuth(fb);

    let selectedBot = null;

    var isBotControlOpen = false;
    

    function selectBot(bot) {
        var oldSelectedBot = selectedBot;
        selectedBot = bot;
        hasStatusForSelectedBot = false;

        if (!oldSelectedBot) {
            // Find the bot_control div and change opacity to 1 and margin-top to 0
            // also in a requestAnimationFrame

            sleep(100).then(() => {
                var botControl = document.querySelector(".bot_control");
                requestAnimationFrame(() => {
                    
                    botControl.style.opacity = "1";

                    var isScreenSizeSmall = window.innerWidth < 1116;
                    
                    if(!isScreenSizeSmall)
                        // @ts-ignore
                        botControl.style.marginTop = "5px";
                    else
                        // @ts-ignore
                        botControl.style.marginTop = "0px";


                    if (!isBotControlOpen && isScreenSizeSmall) {
                        // display none for bot list
                        var botList = document.querySelector("#search");
                        botList.style.display = "none";
                        isBotControlOpen = true;
                    }
                })
            })
        }

        let consoleMessageDivs = document.querySelectorAll(".console_message");
        requestAnimationFrame(() => {
            consoleMessageDivs.forEach(div => {
                // @ts-ignore
                div.style.opacity = "0";
                // @ts-ignore
                div.style.marginTop = "10px";
            })
        })

        sleep(200).then(() => {
            consoleMessages = [];
        })

        updateBotStatus(bot.id);
        getConsole(bot);
    }

    function closeBotControl() {
        var botControl = document.querySelector(".bot_control");
        requestAnimationFrame(() => {
            botControl.style.opacity = "0";
            botControl.style.marginTop = "35px";
        })

        sleep(700).then(() => {
            selectedBot = null;
            var botList = document.querySelector("#search");
            botList.style.display = "block";
            isBotControlOpen = false;
        })
    }

    async function updateBotStatus(botId) {
        fetch('https://api.bh.slz.lol/status?bot=' + botId, {
            method: 'GET',
            headers: {
                "Authorization": await auth.currentUser.getIdToken()
            }
        }).then(res => res.json()).then(data => {
            status = data.status;
            console.log(data.status);
            hasStatusForSelectedBot = true;
        }).catch(err => {
            console.log(err);
        })
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onAuthStateChanged(auth, async (u) => {
        var token = await u.getIdToken();
        fetch('https://api.bh.slz.lol/bots', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + token
            },
        }).then(res => res.json()).then(data => {
            bots = data;
            allBots = data;
            loaded = true;
        }).catch(err => {
            console.log(err);
        })
    });

    var botConsoles = [
        {
            "id": "lol",
            "messages": []
        }
    ]

    async function getConsole(bot) {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`https://api.bh.slz.lol/console?bot=${bot.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      consoleMessages = data; // Update the console messages
      scrollToBottom(); // Scroll to the bottom of the div
    } else {
      console.log('Error:', response.statusText);
    }

  } catch (err) {
    console.log(err);
  }
}

    // @ts-ignore
    function getCachedConsole(botId) {
        for (var i = 0; i < botConsoles.length; i++) {
            if (botConsoles[i].id == botId) {
                return botConsoles[i].messages;
            }
        }

        return [];
    }

    onMount(() => {
  // Fetch console data when the component is mounted
  if (selectedBot) {
    getConsole(selectedBot);
    updateBotStatus(selectedBot.id);
  }
});

setInterval(() => {
  // Fetch console data every 5 seconds
  if (selectedBot) {
    getConsole(selectedBot);
    updateBotStatus(selectedBot.id);
  }
}, 5000);

function scrollToBottom() {
    /* Give svlete time to render the new messages */
    sleep(100).then(() => {
        var consoleDiv = document.querySelector(".console");
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    })
  }

  var hasStatusForSelectedBot = false;
  var status = 0;

  async function updateStatusForSelectedBot(status) {
    fetch('https://api.bh.slz.lol/status?bot=' + selectedBot.id, {
      method: 'POST',
      headers: {
        "Authorization": await auth.currentUser.getIdToken(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: status
      })
    }).then(res => res.json()).then(data => {
      console.log(data);
    }).catch(err => {
      console.log(err);
    })
  }

  var searchInput = "";

 // @ts-ignore
   $ : if (searchInput.length > 0) {
    bots = allBots.filter(bot => bot.name.toLowerCase().includes(searchInput.toLowerCase()));
  } else if (searchInput.length == 0) {
    bots = allBots;
  }

  var pageWidth = window.innerWidth;
  document.addEventListener("resize", () => {
    pageWidth = window.innerWidth;
  })
</script>

<div id="bl_container" class="container">
    <input id="search" bind:value={searchInput} type="text" class="search" placeholder="Search your bots" />
    <div class="bot_list">
        {#if !loaded}
        <!-- Display Skeleton -->
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        <div class="skeleton-loader">
            <md-icon class="skeleton-loader__icon">
                dns
            </md-icon>
            <div class="skeleton-loader__text"></div>
        </div>
        {/if}
        {#if loaded}
            {#each bots as bot}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="bot" on:click={() => {selectBot(bot)}}>
                    <md-icon class="bot__icon">
                        dns
                    </md-icon>
                    <div class="bot__text">{bot.name}</div>
                </div>
            {/each}
        {/if}
    </div>
    
{#if selectedBot}
<div class="bot_control">
  <div class="header">
    {#if hasStatusForSelectedBot}
    <div class="header__status-indicator" aria-label="{status == 1 ? "Online" : "Offline"}" style="background-color: {status == 1 ? "rgb(38, 195, 38)" : "gray"}"></div>
    {/if}
    <div class="header__text">{selectedBot.name}</div>
    <br>
    <div class="header__sub">
        /var/bothive/bots/{selectedBot.id}
    </div>

    <div class="header_left">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <md-icon style="margin-top: 3px;" on:click={
            closeBotControl
        }>close</md-icon>
    </div>
  </div>

  <div class="console">
    <div class="console__text">
      {#each consoleMessages as line}
        <div class="console_message">
            {line.content}
            <br>
        </div>
      {/each}
    </div>
  </div>

    <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="control_buttons">
    <md-tonal-button on:click={() => {
        updateStatusForSelectedBot(0)
    }}>Start</md-tonal-button>
    <md-tonal-button on:click={() => {
        updateStatusForSelectedBot(1)
    }}>Stop</md-tonal-button>
    <md-tonal-button on:click={() => {
        updateStatusForSelectedBot(2)
    }}>Restart</md-tonal-button>
    <md-tonal-button on:click={() => {
        updateStatusForSelectedBot(3)
    }}>Kill</md-tonal-button>
  </div>
</div>
{/if}

</div>

<style>
    .header_left {
        position: absolute;
        right: 3%;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .header_left > * {
        margin-bottom: 2px;
        margin-right: 3px;
    }

    .header_left:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .header_left:active {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .header_left > * {
        cursor: pointer;
        margin-left: 5px;
    }

    .console {
        display: inline-block;
    }
    .console_message {
        transition: all 0.1s cubic-bezier(0.2, 0.0, 0, 1.0);
    }
    .header__sub {
        font-size: 12px;
        color: rgb(106, 106, 106);
        margin-left: 32px;
        margin-top: 2px;
    }
    .header__status-indicator {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        margin-left: 16px;
    }
    .control_buttons {
        --md-tonal-button-container-color:  var(--md-sys-color-inverse-primary);
        margin-left: 32px;
        margin-top: 16px;
    }

    .control_buttons > * {
        margin-right: 8px;
        margin-bottom: 8px;
    }

    .time {
        font-weight: 600;
        margin-right: 5px;
        color: rgb(106, 106, 106);
    }

    .console {
        width: calc(88% - 32px);
        height: calc(70% - 32px);
        background-color: var(--md-sys-color-inverse-primary);
        border-radius: 32px;
        margin-top: 32px;
        margin-left: 32px;
        padding: 16px;
        overflow-y: scroll;
    }

    .console::-webkit-scrollbar {
        width: 8px;
    }

    .console::-webkit-scrollbar-track {
        background: var(--md-sys-color-inverse-secondary);
    }

    .console__text {
        margin: 16px;
        font: var(--md-sys-typescale-body-medium-font);
        letter-spacing: var(--md-sys-typescale-body-medium-letter-spacing);
        white-space: nowrap; /* Prevent text from wrapping */
        overflow-x: auto; /* Enable horizontal scrolling if needed */
    }

    .console__text::-webkit-scrollbar {
        width: 2px;
        height: 8px;
        border-radius: 16px;
        background-color: white;
    }

    .console__text::-webkit-scrollbar-track {
        background: var(--md-sys-color-primary);
        border-radius: 16px;
    }

    .console__text::-webkit-scrollbar-thumb {
        background-color: white;
        border-radius: 16px;
    }

    .header {
        width: calc(100% - 32px);
        height: calc(8% - 32px);
        background-color: var(--md-sys-color-inverse-primary);
        border-radius: 32px 32px 0 0;
        display: flex;
        align-items: center;
        padding: 16px;
    }

    .header__text {
        margin-left: 16px;
        font: var(--md-sys-typescale-headline-medium-font);
        letter-spacing: var(--md-sys-typescale-headline-medium-letter-spacing);
    }

    .bot_list {
        width: 500px;
        border-radius: 32px;
        background-color: var(--md-sys-color-primary-container);
        height: calc(82% - 16px);
        margin-top: 90px; /* Added margin to create space between search bar and content */
        margin-left: 32px;
        overflow-y: scroll;
        scrollbar-width: thin; /* Added to customize the scrollbar width */
        padding-right: 16px; /* Added right padding to make space for scrollbar */
        padding-top: 16px;
    }

    .bot_control {
        height: 91%;
        width: calc(94% - 500px);
        border-radius: 32px;
        margin-top: 35px;
        margin-left: 32px;
        background-color: var(--md-sys-color-secondary-container);
        opacity: 0;
        transition: all 0.7s cubic-bezier(0.2, 0.0, 0, 1.0);;
    }

    
    .bot_list::-webkit-scrollbar {
        width: 8px; /* Adjust the width as needed */
    }

    .bot_list::-webkit-scrollbar-thumb {
        background-color: rgba(85, 85, 85, 0.201); /* Customize the scrollbar thumb color */
        border-radius: 8px;
    }
    


    /* much cleaner scroll bar */

    .search {
        background-color: var(--md-sys-color-surface-container-high);
        outline: none;
        border: none;
        border-radius: 32px;
        margin-left: 30px;
        height: 56px;
        width: calc(500px - 50px);
        position: absolute; /* Changed to absolute position */
        top: 5%; /* Positioned at the top */
        padding-left: 32px;
        padding-right: 32px;
        letter-spacing: var(--md-sys-typescale-body-large-letter-spacing);
        font: var(--md-sys-typescale-body-large-font);
    }

    .search:focus {
        outline: 2px solid rgb(0, 0, 0);
    }
    

    .container {
        width: calc(100%);
        height: 100%;
        display: flex;
        align-items: center;
        position: relative; /* Added relative position to the container */
    }

    .skeleton-loader {
        display: flex;
        align-items: center;
        margin-left: 32px;
        margin-bottom: 32px;
        margin-top: 32px;
    }

    .skeleton-loader__icon {
        margin-right: 16px;
        animation: pulse 1.5s infinite;
    }

    .skeleton-loader__text {
        width: 95%;
        height: 16px;
        background-color: rgb(255, 255, 255);
        border-radius: 8px;
        animation: pulse 1.5s infinite;
    }

    .bot {
        display: flex;
        align-items: center;
        margin-left: 16px;
        margin-bottom: 5px;
        margin-top: 5px;
        height: 46px;
        border-radius: 16px;
        padding-left: 16px;
        cursor: pointer;
        user-select: none;
    }

    .bot__icon {
        margin-right: 16px;
    }

    .bot__text {
        font: var(--md-sys-typescale-body-large-font);
        letter-spacing: var(--md-sys-typescale-body-large-letter-spacing);
    }

    .bot:hover {
        background-color: var(--md-sys-color-surface-container-high);
    }

    .bot:active {
        background-color: var(--md-sys-color-surface-container-high)
    }

    @keyframes pulse {
        0% {
            opacity: 0.4;
        }

        50% {
            opacity: 0.8;
        }

        100% {
            opacity: 0.4;
        }
    }

    
    @media (max-width: 1116px) {
        .bot_list {
            width: calc(100% - 16px);
            height: calc(100% - 100px);
            margin: 0px;
            border-radius: 0;
            padding: 0px;
            padding-top: 100px;
            padding-left: 16px;
        }

        .bot {
            width: 91%;
        }

        .search {
            background-color: white!important;
            width: 85vw;
            position: absolute;
            top: 32px;
        }

        .bot_control {
            width: 100vw;
            height: 100vh;
            margin: 0;
            border-radius: 0%;
            z-index: 123123;
            position: absolute;
            top: 0;
            left: 0;
            padding: 0;
            margin-top: 10px;
        }

        .header {
            border-radius: 0px;
        }
    }

    @media (max-width: 628px) {
        .search {
            width: 80vw;
        }
    }

    @media (max-width: 500px) {
        .search {
            width: 75vw;
        }
    }

    @media (max-width: 400px) {
        .search {
            width: 70vw;
        }
    }

    @media (max-width: 350px) {
        .search {
            width: 65vw;
        }
    }

</style>