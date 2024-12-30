const container = document.getElementById("option-container");

async function initOptions() {
  try {
    // Recupera la lingua dall'archivio
    const languageResult = await chrome.storage.local.get("language");

    // Invia la richiesta per ottenere le traduzioni
    chrome.runtime.sendMessage(
      { action: "getTranslation", language: languageResult.language },
      (response) => {
        const translations = response.translations;
        generateOptions(translations);
      }
    );
  } catch (error) {
    console.error("Errore nell'inizializzare le opzioni:", error);
  }
}

async function generateOptions(translations) {
  const optionList = document.createElement("ul");
  optionList.classList.add("option-list");
  for (let sw of translations.options) {
    const optionListItem = document.createElement("li");
    optionListItem.classList.add("option-list-item");
    const option = document.createElement("span");
    option.classList.add("option");
    const optionTitle = document.createElement("span");
    optionTitle.id = sw.id;
    optionTitle.classList.add("option-title");
    optionTitle.textContent = sw.title;
    const optionHelpIcon = document.createElement("span");
    optionHelpIcon.id = sw.id + "-help";
    optionHelpIcon.classList.add("help-icon", "material-symbols-outlined");
    optionHelpIcon.textContent = "help";

    option.appendChild(optionTitle);
    option.appendChild(optionHelpIcon);

    const optionSwitch = document.createElement("span");
    optionSwitch.classList.add("option-switch");
    const formCheck = document.createElement("div");
    formCheck.classList.add("form-check", "form-switch");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = sw.id + "-switch";
    input.classList.add("form-check-input");
    input.disabled = sw.disabled;

    const optionValue = await chrome.storage.local.get(sw.id);

    if (optionValue[sw.id] === undefined) {
      chrome.storage.local.set({ [sw.id]: false });
    }
    input.checked =
      optionValue[sw.id] !== undefined ? optionValue[sw.id] : false;

    input.addEventListener("change", (event) => {
      const value = event.target.checked;
      chrome.storage.local.set({ [sw.id]: value });
      chrome.tabs.query({}, (tabs) => {
        const lolTabs = tabs.filter((tab) => tab.url.includes("landsoflords"));
        lolTabs.forEach((tab) => {
          chrome.tabs.reload(tab.id);
        });
      });
    });

    formCheck.appendChild(input);
    optionSwitch.appendChild(formCheck);

    optionListItem.appendChild(option);
    optionListItem.appendChild(optionSwitch);

    optionList.appendChild(optionListItem);
  }
  container.appendChild(optionList);
}

// Inizializza le opzioni
initOptions();
