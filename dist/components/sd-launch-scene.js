var t3=document.createElement("template");t3.innerHTML=`<link href="components/sd-launch-scene.css" rel="stylesheet">
<main-content>
    <h1>Space Defense Engineers</h1>
    <p>
      Planetary protection strategy game. Acquire lucrative contracts and lead a
      fulfilling career defending planets from meeting their untimely demise.
    </p>
    <sd-button play label="Play"></sd-button>
    <sd-button outlined label="Controls"></sd-button>
  </main-content>
`;class LaunchScene extends HTMLElement{connectedCallback(){this.shadowRoot||(this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(t3.content.cloneNode(!0)),this.shadowRoot.querySelector("sd-button[play]").addEventListener("onClick",()=>{dispatchEvent(new CustomEvent("show-game",{bubbles:!0,composed:!0}))}),this.shadowRoot.querySelector("sd-button[outlined]").addEventListener("onClick",()=>{dispatchEvent(new CustomEvent("show-controls",{bubbles:!0,composed:!0}))}))}}customElements.define("sd-launch-scene",LaunchScene);