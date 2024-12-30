const url = window.location.href;
/* if (url.includes('/unit:') && url.includes(':skills')) {
    const divider = document.createElement('hr');
    divider.classList.add('divider');
    const skillTab = document.getElementsByClassName('block')[1].firstChild;
    const affinity = document.createElement('table');
    const tbody = affinity.appendChild(document.createElement('tbody'));
    for (let i = 0; i < 5; i++) {
        const row = tbody.insertRow();
        for (let j = 0; j < 2; j++) {
            const cell = row.insertCell();
            if (j === 0) {
                cell.classList.add('name');
                cell.textContent = 'Prova';
            } else {
                cell.classList.add('bonus', 'green');
                cell.textContent = '75%';
            }
        }
    }
    skillTab.insertBefore(divider, skillTab.firstChild);
    skillTab.insertBefore(affinity, skillTab.firstChild);
} */

/* Aggiungo il blocco note sopra le notifiche (se è attivo) */
async function toggleNotepad() {
  const id = "notepad";
  const isNotepadEnabled = await chrome.storage.local.get(id);
  if (!isNotepadEnabled[id]) {
    return;
  }
  const notifications = document.getElementById("notif");
  if (notifications) {
    notifications.style.height = "50vh";
    notifications.style.top = "50vh";

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          if (notifications.style.height !== "50vh") {
            notifications.style.height = "50vh"; // Ripristina il valore
          }
        }
      });
    });

    // Avvia l'observer sull'elemento
    observer.observe(notifications, {
      attributes: true,
      attributeFilter: ["style"],
    });

    const note = document.createElement("div");
    note.id = id;
    const textarea = document.createElement("textarea");
    textarea.placeholder = "Note...";
    textarea.classList.add("monospace", "bbinput");
    textarea.style.height = "100%";
    textarea.style.overflowY = "auto";

    note.appendChild(textarea);
    notifications.insertAdjacentElement("beforebegin", note);

    let timeoutId;
    const debounceSave = (event) => {
      clearTimeout(timeoutId); // Cancella eventuali timer precedenti
      timeoutId = setTimeout(() => {
        const content = event.target.value;
        // Salva il contenuto su chrome.storage
        chrome.storage.local.set({ notes: content });
      }, 1000); // 1 secondo di ritardo
    };

    // Recupera il contenuto salvato, se esiste
    chrome.storage.local.get("notes", (result) => {
      if (result.notes) {
        textarea.value = result.notes; // Imposta il valore recuperato
      }
    });

    // Ascolta gli eventi di input nella textarea
    textarea.addEventListener("input", debounceSave);
  }
}

toggleNotepad();
