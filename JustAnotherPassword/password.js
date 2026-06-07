document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("generatedPassword", (result) => {
    const pw = result.generatedPassword;
    const pwEl = document.getElementById("pw");

    if (!pw || !pwEl) {
      if (pwEl) {
        pwEl.textContent = "No password in memory. Please generate a new one.";
      }
      return;
    }

    function showClipboardInfo() {
      const infoPopup = document.getElementById("clipboard-info");
      if (infoPopup) {
        infoPopup.style.display = "flex";
      }
    }

    function hideClipboardInfo() {
      const infoPopup = document.getElementById("clipboard-info");
      if (infoPopup) {
        infoPopup.style.display = "none";
      }
    }

    function clearStoredPassword(logMessage) {
      chrome.storage.local.remove("generatedPassword", () => {
        if (logMessage) {
          console.log(logMessage);
        }
      });
    }

    function showExpirationNotice() {
      const bar = document.querySelector(".success__title");
      const countdowns = document.querySelectorAll(".countdown");

      if (!bar || countdowns.length === 0) {
        console.warn("Success banner or countdown element not found.");
        return;
      }

      let timeLeft = 30;
      countdowns.forEach(el => {
        el.textContent = ` ${timeLeft} `;
      });

      bar.style.display = "flex";

      const timer = setInterval(() => {
        timeLeft--;

        countdowns.forEach(el => {
          el.textContent = ` ${timeLeft} `;
        });

        if (timeLeft <= 0) {
          clearInterval(timer);
          bar.remove();
        }
      }, 1000);
    }

    pwEl.textContent = pw;

    const copyBtn = document.getElementById("copy");
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(pw)
          .then(() => {
            console.log("Password copied to clipboard.");
            showExpirationNotice();
          })
          .catch((err) => {
            console.error("Failed to copy:", err);
            alert("Failed to copy password to clipboard.");
          });
      };
    } else {
      console.warn("Copy button not found.");
    }

    const closeBtn = document.getElementById("close-button");
    if (closeBtn) {
      closeBtn.onclick = () => {
        navigator.clipboard.writeText("Clipboard cleared.")
          .then(() => {
            console.log("Clipboard cleared manually.");
            chrome.storage.local.remove("generatedPassword", () => {
              console.log("Password cleared manually.");
              window.close();
            });
          })
          .catch((err) => {
            console.info("Clipboard could not be cleared manually:", err);
            showClipboardInfo();

            chrome.storage.local.remove("generatedPassword", () => {
              console.log("Password cleared despite clipboard clear failure.");
              window.close();
            });
          });
      };
    } else {
      console.warn("Close button not found.");
    }

    const infoCloseBtn = document.getElementById("clipboard-info-close");
    if (infoCloseBtn) {
      infoCloseBtn.onclick = hideClipboardInfo;
    }
  });
});

setTimeout(() => {
  chrome.storage.local.remove("generatedPassword", () => {
    console.log("Password auto-cleared after 30 seconds.");
  });
}, 30000);

setTimeout(() => {
  if (document.hasFocus()) {
    navigator.clipboard.writeText("Clipboard cleared.")
      .then(() => console.log("Clipboard overwritten after timeout."))
      .catch((err) => {
        console.info("Clipboard overwrite failed after timeout:", err);
        const infoPopup = document.getElementById("clipboard-info");
        if (infoPopup) {
          infoPopup.style.display = "flex";
        }
      });
  } else {
    console.info("Clipboard not cleared because document was not focused.");

    const infoPopup = document.getElementById("clipboard-info");
    if (infoPopup) {
      infoPopup.style.display = "flex";
    }
  }
}, 30000);