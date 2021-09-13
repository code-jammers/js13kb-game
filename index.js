changeScene = (scene) => {
  cs = G.allScenes.find((s) => s === scene);
  if (cs) {
    G.cs = cs;
    const os = document.querySelector("[in-progress]");
    if (os) {
      document.body.removeChild(os);
    }

    switch (cs) {
      case GAME_SCENE:
        renderWebComponent("sd-game-scene");
        break;
      case LOADING_SCENE:
      default:
        renderWebComponent("sd-loading-scene");
        break;
    }
  }
};

renderWebComponent = (tagname) => {
  let el = dcr(tagname,document);
  el.setAttribute("in-progress", true);
  el.style.cssText = "opacity: 0; display: block; transition: opacity .3s";
  dba(el,document);
  setTimeout(() => {
    el.style.opacity = "1";
  }, 200);
};

changeScene(LOADING_SCENE);
addEventListener("scene-change", (e) => {
  changeScene(e.detail);
});

Promise.all(
  ["sd-game-scene"].map((component) =>
    customElements.whenDefined(component)
  )
).then((p) => {
  setTimeout(() => {
    changeScene(GAME_SCENE);
  }, 1000);
});

addEventListener("show-game", (e) => changeScene(GAME_SCENE));
addEventListener("show-controls", (e) => alert("coming soon"));
