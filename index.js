changeScene = (scene) => {
  currentScene = GAME_DATA.allScenes.find((s) => s === scene);
  if (currentScene) {
    GAME_DATA.currentScene = currentScene;
    const oldScene = document.querySelector("[in-progress]");
    if (oldScene) {
      document.body.removeChild(oldScene);
    }

    let el;
    switch (currentScene) {
      case GAME_SCENE:
        renderWebComponent("sd-game-scene");
        break;
      case LAUNCH_SCENE:
        renderWebComponent("sd-launch-scene");
        break;
      case LOADING_SCENE:
      default:
        renderWebComponent("sd-loading-scene");
        break;
    }
  }
};

renderWebComponent = (tagname) => {
  el = document.createElement(tagname);
  el.setAttribute("in-progress", true);
  el.style.opacity = "0";
  el.style.display = "block";
  el.style.transition = "opacity 0.3s";
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "1";
  }, 200);
};

changeScene(LOADING_SCENE);
window.addEventListener("scene-change", (e) => {
  changeScene(e.detail);
});
let componentsToLoad = document.querySelectorAll("script[defer]").length;

console.log(`Loading ${componentsToLoad} async components`);

const loadedComponents = [];
window.addEventListener("has-connected", (e) => {
  loadedComponents.push(e.detail);
  console.log(`${e.detail}: loaded`);
  if (loadedComponents.length === componentsToLoad) {
    setTimeout(() => {
      changeScene(LAUNCH_SCENE);
    }, 1000);
  }
});
window.addEventListener("show-game", (e) => changeScene(GAME_SCENE));
window.addEventListener("show-controls", (e) => alert("coming soon"));
