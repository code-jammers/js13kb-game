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

  handleMenuOptionClick(event) {
    const option = event.target.textContent;
    console.log(`Selected option: ${option}`);
    if (option?.toLowerCase() === "options") {
      this.menu.setAttribute("page", "options");
    } else if (option?.toLowerCase() === "back") {
      this.menu.setAttribute("page", "menu");
    } else if (option?.toLowerCase() === "exit") {
      this.closeMenu();
    }
  }
}
