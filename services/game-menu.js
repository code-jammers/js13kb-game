class GameMenu {
  constructor(menuElement, triggerElement, backdropElement) {
    this.menu = menuElement;
    this.trigger = triggerElement;
    this.backdrop = backdropElement;
    console.log(this.menu, this.trigger, this.backdrop);
    this.init();
  }

  init() {
    this.trigger.addEventListener("click", () => {
      if (!this.menu.hasAttribute("open")) {
        this.openMenu();
      }
    });

    this.backdrop.addEventListener("click", () => {
      console.log("Backdrop clicked");
      this.closeMenu();
    });

    this.menu.querySelectorAll(".menu-option").forEach((option) => {
      option.addEventListener("click", (event) => {
        this.handleMenuOptionClick(event);
      });
    });

    this.menu.setAttribute("page", "menu");
  }

  openMenu() {
    this.menu.showPopover();
    this.menu.setAttribute("open", true);
    this.showBackdrop();
  }

  closeMenu() {
    this.menu.hidePopover();
    this.menu.removeAttribute("open");
    this.hideBackdrop();
  }

  showBackdrop() {
    this.backdrop.style.display = "block";
  }

  hideBackdrop() {
    this.backdrop.style.display = "none";
  }

  async schedule() {
    try {
      var url = localStorage.getItem("scheduler");
      if (url.endsWith("/"))
        url = url.substring(0, url.length-1);
      const response = await fetch(url + "/schedule");
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);

      setTimeout(() => {
        this.menu.setAttribute("players", data.players);
      }, 3000);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }

  handleMenuOptionClick(event) {
    const option = event.target.textContent;
    console.log(`Selected option: ${option}`);
    if (option?.toLowerCase() === "options") {
      this.menu.setAttribute("page", "options");
    } else if (option?.toLowerCase() === "back") {
      this.menu.setAttribute("page", "menu");
    } else if (option?.toLowerCase() === "join") {
      this.menu.setAttribute("page", "join");
      this.schedule();
    } else if (option?.toLowerCase() === "multiplayer") {
      this.menu.setAttribute("page", "multiplayer");
    } else if (option?.toLowerCase() === "start") {
      window.GAME_DATA.multiplayer = true;
      this.closeMenu();
    } else if (option?.toLowerCase() === "exit") {
      this.closeMenu();
    }
  }
}
