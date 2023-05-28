<script>
  import { onMount } from "svelte";
  import '@material/web/textfield/filled-text-field.js'
  import { fb } from "../main.js";
  import { getAuth } from "firebase/auth";

  const auth = getAuth(fb);
    onMount(() => {
        requestAnimationFrame(() => {
            // @ts-ignore
            document.querySelector(".create_bot").style.opacity = "1";
            // @ts-ignore
            document.querySelector(".create_bot").style.marginTop = "0px";
        })


        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', handleFileUpload);

        function handleFileUpload(event) {
            const file = event.target.files[0];
            // Do something with the uploaded file
            console.log(file);

            // Display the file name
            const fileNameElement = document.getElementById('file-name');
            fileNameElement.textContent = file ? file.name : '';
  
        }
    })

    function openFileUpload() {
        const fileInput = document.getElementById('file-input');
        fileInput.click();
    }

    var isLoading = false;
    var isError = false;

    var name;
    var startCommand;
    var port;
    var file;

    async function createBot() {
        isError = false;
        console.log(name.value);
        if (name.value == "") {
            isError = true;
            return;
        }

        if (startCommand.value == "") {
            isError = true;
            return;
        }

        const isPortValueInt = Number.isInteger(parseInt(port.value));
        if (port.value == "" || !isPortValueInt || parseInt(port.value) < 0 || parseInt(port.value) > 65535) {
            isError = true;
            return;
        }

        // get file from file input
        const actualFile = file.files[0];

        if (!actualFile) {
            isError = true;
            return;
        }

        // If it doesn't end in .jar, return
        if (!actualFile.name.endsWith(".jar")) {
            isError = true;
            return;
        }

        isLoading = true;

        fetch("https://api.bh.slz.lol/bots", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": await auth.currentUser.getIdToken()
            },
            body: JSON.stringify({
                name: name.value,
                start_command: startCommand.value,
                port: parseInt(port.value)
            })
        }).then(async (res) => {
            console.log(res);
        
            const data = await res.json();
            var id = data.id;

            const formData = new FormData();
            formData.append('file', actualFile);

            fetch("https://api.bh.slz.lol/bot_file?bot=" + id, {
                method: "POST",
                headers: {
                    "Authorization": await auth.currentUser.getIdToken()
                },
                body: formData
            // @ts-ignore
            }).then((res) => {
                isLoading = false;
                window.location.href = "/";
            })
        })

    }
</script>

{#if isLoading}
<div class="loading_scrim">
    <div class="loading_container">
        <div class="lds-ripple"><div></div><div></div></div>
    </div>
</div>
{/if}

<div class="create_bot">
    <p class="header">Create a new bot</p>
    <p class="sub_header">
        Hosting bots with Bothive is easy. Let's get you set up with a new bot. First, please enter the desired name of your bot.
    </p>
    <div class="text_fields">
        <md-filled-text-field bind:this={name} maxlength=30 minlength=4 required label="Name" />
        <div style="margin: 16px" />
        <p class="sub_header">
            Next, please enter the start comamnd for your bot. For example, <code>java -jar bot.jar</code>. Note that the start file for your bot is always <code>bot.jar</code>.
        </p>
        <md-filled-text-field bind:this={startCommand} required label="Start command" />

        <p class="sub_header">
            Please also enter a port for the bot to run on. It must not be taken already.
        </p>
        <md-filled-text-field bind:this={port} required label="Port" type="number" />

        <p class="sub_header">
            Finally, please upload your bot's jar file. This is the file that will be executed when your bot is started.
        </p>
        <div class="file_input">
            <input type="file" bind:this={file} id="file-input" style="display: none;">
            <label for="file-input">
                <md-filled-button on:click={openFileUpload}>Upload</md-filled-button>
            </label>
            <p id="file-name"></p>
        </div>
    </div>

    <div class="bottom_center">
        {#if isError}
        <p class="sub_header error">An error occured while creating your bot. Please make sure you've filled out all fields.</p>
        {/if}
    </div>

    <div class="bottom_right">
        <md-filled-button on:click={createBot}>Create</md-filled-button>
    </div>
</div>

<style>

    .error {
        color: var(--md-sys-color-error);
    }

    .file_input {
        margin-top: 32px;
        width: 90px
    }

.loading_scrim {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 234523;
    background-color: rgba(0, 0, 0, 0.5);
}

.bottom_right {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 16px;
}

.bottom_center {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    margin: 16px;
    width: 100%;
    text-align: center;
}

.loading_scrim .loading_container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.lds-ripple {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ripple div {
  position: absolute;
  border: 4px solid #fff;
  opacity: 1;
  border-radius: 50%;
  animation: lds-ripple 1.2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
  animation-delay: -0.5s;
}
@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  4.9% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 0;
  }
  5% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}

    .sub_header {
        margin-top: 4px;
        font: var(--md-sys-typescale-body-large-font);
        letter-spacing: var(--md-sys-typescale-body-large-letter-spacing);
    }

    .text_fields {
        margin-top: 32px;
        
    }

    .create_bot {
        width: calc(95% - 128px);
        height: calc(95% - 128px);
        position: relative;
        border-radius: 32px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);   
        background-color: var(--md-sys-color-surface-container-high);
        padding: 64px;

        /* Animation */
        opacity: 0;
        margin-top: 32px;
        transition: all 0.7s cubic-bezier(0.2, 0.0, 0, 1.0);
    }

    .header {
        font: var(--md-sys-typescale-display-medium-font);
        letter-spacing: var(--md-sys-typescale-display-medium-letter-spacing);
        margin: 0px;
    }

    @media (max-width: 650px) {
        .create_bot {
            width: calc(95% - 64px);
            height: calc(95% - 64px);
            padding: 32px;
        }
    }

    @media (max-width: 528px) {
        .header {
            font: var(--md-sys-typescale-headline-medium-font);
            letter-spacing: var(--md-sys-typescale-headline-medium-letter-spacing);
        }
    }

</style>