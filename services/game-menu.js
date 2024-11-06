class GameMenu {
  constructor(menuElement, triggerElement, backdropElement) {
    this.menu = menuElement;
    this.trigger = triggerElement;
    this.backdrop = backdropElement;

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
    this.closeMenu();
  }
}
