/* CONSTANTS */
const DERIVED = "derived";
const INNATE = "innate";

/* Global variables */

let skillShowing = DERIVED;
let derivedSkillTable = null;
let innateSkillTable = null;
let theme = "light";

const url = window.location.href;
const linkElement = document.querySelector('link[rel="stylesheet"]');
const hrefValue = linkElement.getAttribute("href");

// Estrai "dark" o "light" con un'espressione regolare
const themeMatch = hrefValue.match(/\.(dark|light)\./);

// Se il tema è presente, accedi al valore
if (themeMatch) {
  theme = themeMatch[1]; // "dark" o "light"
  console.log("Tema:", theme);
} else {
  console.log("Tema non trovato");
}

async function isOptionEnabled(id) {
  const option = await chrome.storage.local.get(id);
  return option[id];
}

function calculateAbilityBonus(abilityStats, unitStats) {
  return abilityStats.reduce((bonus, stat) => {
    const statValue = unitStats[stat] || 0; // Valore della statistica, 0 se non esiste
    const statBonus = (statValue - 10) / 2; // Calcola il bonus della statistica
    if (statBonus < 0) {
      return bonus + Math.ceil(statBonus); // Arrotonda per eccesso
    } else {
      return bonus + Math.floor(statBonus); // Arrotonda per difetto
    }
  }, 0);
}

function updateSkillTable(tbody, skills) {
  const startIndex = page * skillsPerPage;
  const endIndex = startIndex + skillsPerPage;

  // Aggiungi le righe corrispondenti alla pagina attuale
  for (let i = startIndex; i < endIndex && i < skills.length; i++) {
    const skill = skills[i];
    const row = tbody.insertRow();

    addSkillRow(row, skill);
  }

  // Incrementa la pagina corrente
  page++;

  return page * skillsPerPage < skills.length;
}

function addSkillTable(tbody, skills) {
  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];
    const row = tbody.insertRow();

    addSkillRow(row, skill);
  }
}

function addSkillRow(row, skill) {
  const nameCell = row.insertCell();
  const bonusCell = row.insertCell();

  nameCell.classList.add("name");

  const name = document.createElement("a");
  name.classList.add("skill");
  name.href = skill.link;
  name.textContent = skill.name;

  /* const help = document.createElement("img");
  help.classList.add("txt");
  help.src = `/skin/${theme}/icon/help.png`;

  help.title = skill.stats.join("/"); */

  /* help.addEventListener("click", () => {
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.style.display = "block";

      const content = document.createElement("div");
      content.classList.add("uinfo", "round", "hyphen");

      const modalTitle = document.createElement("h2");
      modalTitle.textContent = `${skill.name} (${skill.stats.join("/")})`;
      const units = document.createElement("ul");
      units.classList.add("specialized-units");

      units.style.fontSize = "0.9rem";
      units.style.lineHeight = "0.75rem";

      for (const unit of skill.specialised_units) {
        const item = document.createElement("li");
        item.style.listStyle = "none";
        item.textContent = unit.name;
        units.appendChild(item);
      }

      content.appendChild(modalTitle);
      content.appendChild(units);

      modal.appendChild(content);

      document.body.appendChild(modal);
    }); */

  /* const helpContainer = document.createElement("a");
  helpContainer.classList.add("blur", "skill-help");

  helpContainer.appendChild(help); */

  nameCell.appendChild(name);
  //nameCell.appendChild(helpContainer);

  if (skill.bonus > 0) {
    bonusCell.classList.add("bonus", "green");
    bonusCell.textContent = `+${skill.bonus}`;
  } else if (skill.bonus < 0) {
    bonusCell.classList.add("bonus", "red");
    bonusCell.textContent = skill.bonus;
  } else {
    bonusCell.classList.add("bonus");
    bonusCell.textContent = skill.bonus;
  }
}

/* Aggiungo il blocco note sopra le notifiche (se è attivo) */
async function toggleNotepad(translations) {
  const id = "notepad";
  //const isNotepadEnabled = await chrome.storage.local.get(id);
  if (!(await isOptionEnabled(id))) {
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
    textarea.placeholder = translations.notepad.placeholder;
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

async function addInnateSkills(translations) {
  if (!(await isOptionEnabled("affinities"))) {
    return;
  }
  if (url.includes("/unit:")) {
    const selectedTab = document.querySelector(".tab.selected");
    if (selectedTab.href.includes("skills")) {
      chrome.runtime.sendMessage(
        { action: "getSkills", language: translations.language },
        (response) => {
          const allSkills = response.skills;
          let ustats = document
            .getElementById("ustats")
            .querySelectorAll("span.nowrap");

          ustats = Array.from(ustats).filter(
            (span) => span.querySelector("b.pre") !== null
          );

          const unitStats = {};

          for (const stat of ustats) {
            const key = stat
              .querySelector("b.pre")
              .textContent.replace(":", "");
            const value = stat.childNodes[1].nodeValue.trim().replace(".", "");
            unitStats[key] = value;
          }

          allSkills.map((s) => {
            s["bonus"] = calculateAbilityBonus(s.stats, unitStats);
          });

          allSkills.sort((a, b) => {
            return b.bonus - a.bonus;
          });

          const divider = document.createElement("hr");
          divider.classList.add("divider");

          const skillTab =
            document.getElementsByClassName("block")[1].firstChild;

          derivedSkillTable = skillTab.children[0];

          const affinity = document.createElement("table");
          affinity.classList.add("mgmt");
          const tbody = affinity.appendChild(document.createElement("tbody"));

          addSkillTable(tbody, allSkills);

          innateSkillTable = affinity;
          innateSkillTable.style.display = "none";

          const changeSkillMode = document.createElement("a");
          changeSkillMode.textContent = translations.skills.innate;
          changeSkillMode.addEventListener("click", () => {
            if (skillShowing === INNATE) {
              skillShowing = DERIVED;
              changeSkillMode.textContent = translations.skills.innate;
              innateSkillTable.style.display = "none";
              derivedSkillTable.style.display = "block";
            } else {
              skillShowing = INNATE;
              changeSkillMode.textContent = translations.skills.derived;
              innateSkillTable.style.display = "block";
              derivedSkillTable.style.display = "none";
            }
          });

          const selectModeContainer = document.createElement("div");
          selectModeContainer.classList.add("select-mode-container");

          selectModeContainer.appendChild(changeSkillMode);

          skillTab.insertBefore(innateSkillTable, skillTab.firstChild);
          skillTab.insertBefore(divider, skillTab.firstChild);
          skillTab.insertBefore(selectModeContainer, skillTab.firstChild);
        }
      );
    }
  }
}

async function addComponents() {
  //const languageResult = await chrome.storage.local.get("language");
  const languageResult = document.documentElement.lang;

  chrome.runtime.sendMessage(
    { action: "getTranslation", language: languageResult },
    (response) => {
      const translations = response.translations;
      toggleNotepad(translations);
      addInnateSkills(translations);
    }
  );
}

addComponents();
