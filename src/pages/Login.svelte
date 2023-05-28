<script>
  import { fb } from '../main.js'
  import { GoogleAuthProvider, getAuth, signInWithPopup, onAuthStateChanged } from 'firebase/auth'

  const auth = getAuth(fb)
  onAuthStateChanged(auth, (u) => {
    if (u) window.location.href = '/'
  })

  function liwg() {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result)
        const token = credential.accessToken
        const user = result.user
        console.log(user)
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.email
        const credential = GoogleAuthProvider.credentialFromError(error)
        console.log(errorCode, errorMessage, email, credential)
      })
  }
</script>

<div class="container">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <md-filled-button on:click={liwg}>Log in with Google</md-filled-button>
</div>

<style>
    .container {
        background-color: var(--md-sys-color-primary-container);
        width: 40%;
        height: 80%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>