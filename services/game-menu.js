class GameMenu {
  constructor(menuElement, triggerElement, backdropElement) {
    this.menu = menuElement;
    this.trigger = triggerElement;
    this.backdrop = backdropElement;

    // Initialize event listeners
    this.init();
  }

  init() {
    // Open the menu when the trigger button is clicked
    this.trigger.addEventListener("click", () => {
      if (this.menu.hasAttribute("open")) {
        this.menu.hidePopover();
        this.menu.open = false;
        this.backdrop.style.display = "none";
      } else {
        this.menu.showPopover();
        this.menu.open = true;
        this.backdrop.style.display = "block";
      }
    });

    // Add event listeners to menu options (optional)
    this.menu.querySelectorAll(".menu-option").forEach((option) => {
      option.addEventListener("click", (event) => {
        this.handleMenuOptionClick(event);
      });
    });
  }

  handleMenuOptionClick(event) {
    const option = event.target.textContent;
    console.log(`Selected option: ${option}`);

    // Hide the menu after an option is clicked (optional)
    this.menu.hidePopover();
  }
}
