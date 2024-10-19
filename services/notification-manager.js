let showingNotification = false;
let notifications = [];

setNotification = (text, subtext, timeout, color) => {
  if (showingNotification) {
    if (text !== notifications?.[0]?.text) {
      notifications.push({ text, subtext, timeout, color });
    }
    return;
  }
  try {
    showingNotification = true;
    var notification = document.createElement("sd-notification");
    notification.id = "notification";
    notification.setAttribute("header", text);
    notification.setAttribute("text", subtext);
    notification.setAttribute("show", true);
    notification.setAttribute("color", color);
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.removeAttribute("show");
      setTimeout(() => {
        notification.remove();
        showingNotification = false;

        if (notifications.length > 0) {
          setNotification(
            notifications[0].text,
            notifications[0].subtext,
            notifications[0].timeout,
            notifications[0].color
          );
          notifications.shift();
        }
      }, 1000);
    }, timeout);
  } catch (_) {}
};
