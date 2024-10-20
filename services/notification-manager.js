class NotificationManager {
  constructor(context) {
    this.notificationsQueue = []; 
    this.currentNotification = null;
    this.showingNotification = false;
    this.context = context || document.body;
  }

  #createNotification({ text, subtext, color }) {
    const notification = document.createElement("sd-notification");
    notification.setAttribute("header", text);
    notification.setAttribute("text", subtext);
    notification.setAttribute("show", true);
    notification.setAttribute("color", color);

    return notification;
  }

  sendNotification(text, subtext, timeout = 3000, color = "default") {
    // Prevent duplicate notifications if the same one is still showing
    if (this.showingNotification) {
      const isDuplicate = this.notificationsQueue.some(
        (n) => n.text === text && n.subtext === subtext
      );
      if (!isDuplicate) {
        this.notificationsQueue.push({ text, subtext, timeout, color });
      }
      return;
    }

    // Create the notification and show it
    const notification = this.#createNotification({ text, subtext, color });
    this.showingNotification = true;
    this.context.appendChild(notification);

    // Remove the notification after the timeout and show the next one if present
    setTimeout(() => {
      notification.remove();
      this.showingNotification = false;

      if (this.notificationsQueue.length > 0) {
        const nextNotification = this.notificationsQueue.shift();
        this.sendNotification(
          nextNotification.text,
          nextNotification.subtext,
          nextNotification.timeout,
          nextNotification.color
        );
      }
    }, timeout);
  }
}
