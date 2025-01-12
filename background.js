const supportedLanguages = ["en", "it", "es", "fr", "ua", "pt", "ru"];
const defaultLanguage = "en";

/* chrome.runtime.onInstalled.addListener(() => {
  //chrome.storage.local.clear();
  // Recupera la lingua del browser
  const browserLanguage = navigator.language || navigator.userLanguage;
  // Imposta la lingua predefinita (se non è già stato fatto)
  chrome.storage.local.get("language", (result) => {
    if (!result.language) {
      const language = browserLanguage.split("-")[0];
      if (supportedLanguages.includes(language)) {
        chrome.storage.local.set({ language });
      } else {
        chrome.storage.local.set({ language: defaultLanguage });
      }
    }
  });
}); */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTranslation") {
    const language = request.language || defaultLanguage; // Ottieni la lingua selezionata
    fetch(`./i18n/${language}.json`)
      .then((response) => response.json())
      .then((data) => sendResponse({ translations: data }))
      .catch((err) => console.error("Error loading translations", err));
  }
  if (request.action === "getSkills") {
    const language = request.language || defaultLanguage; // Ottieni la lingua selezionata
    fetch(`./assets/data/skills/${language}.json`)
      .then((response) => response.json())
      .then((data) => sendResponse({ skills: data }))
      .catch((err) => console.error("Error loading skills", err));
  }
  return true; // Mantieni il canale di comunicazione aperto per la risposta asincrona
});
