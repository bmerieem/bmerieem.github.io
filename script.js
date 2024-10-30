// Textes multilingues
const translations = {
  en: {
    title: "Night Third Calculator",
    labelSunset: "Sunset Time:",
    labelFajr: "Fajr Time:",
    calculateButton: "Calculate Thirds",
    resetButton: "Reset",
    firstThird: "First third of the night:",
    lastThird: "Last third of the night:"
  },
  fr: {
    title: "Calculateur de Tiers de Nuit",
    labelSunset: "Heure du Coucher de Soleil :",
    labelFajr: "Heure de la Prière du Matin (Fajr) :",
    calculateButton: "Calculer les Tiers",
    resetButton: "Réinitialiser",
    firstThird: "Premier tiers de la nuit :",
    lastThird: "Dernier tiers de la nuit :"
  }
};

// Charger les traductions et données enregistrées au démarrage
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  changeLanguage();
});

function calculateTiers() {
  const sunset = document.getElementById('sunset').value;
  const fajr = document.getElementById('fajr').value;

  if (!sunset || !fajr) {
    alert("Veuillez entrer les deux heures.");
    return;
  }

  const sunsetTime = new Date(`1970-01-01T${sunset}:00`);
  const fajrTime = new Date(`1970-01-01T${fajr}:00`);
  if (fajrTime < sunsetTime) {
    fajrTime.setDate(fajrTime.getDate() + 1);
  }

  const nightDuration = fajrTime - sunsetTime;
  const thirdOfNight = nightDuration / 3;
  const firstThird = new Date(sunsetTime.getTime() + thirdOfNight);
  const lastThird = new Date(fajrTime.getTime() - thirdOfNight);

  document.getElementById('result').innerHTML = `
    <p>${translations[getLanguage()].firstThird} ${firstThird.toTimeString().slice(0, 5)}</p>
    <p>${translations[getLanguage()].lastThird} ${lastThird.toTimeString().slice(0, 5)}</p>
  `;

  saveData(sunset, fajr);
  requestNotification(firstThird, lastThird);
}

function resetFields() {
  document.getElementById('sunset').value = '';
  document.getElementById('fajr').value = '';
  document.getElementById('result').innerHTML = '';
  localStorage.removeItem("sunset");
  localStorage.removeItem("fajr");
}

function saveData(sunset, fajr) {
  localStorage.setItem("sunset", sunset);
  localStorage.setItem("fajr", fajr);
}

function loadStoredData() {
  const storedSunset = localStorage.getItem("sunset");
  const storedFajr = localStorage.getItem("fajr");
  if (storedSunset) document.getElementById('sunset').value = storedSunset;
  if (storedFajr) document.getElementById('fajr').value = storedFajr;
}

function changeLanguage() {
  const lang = getLanguage();
  document.getElementById('title').textContent = translations[lang].title;
  document.getElementById('labelSunset').textContent = translations[lang].labelSunset;
  document.getElementById('labelFajr').textContent = translations[lang].labelFajr;
  document.getElementById('calculateButton').textContent = translations[lang].calculateButton;
  document.getElementById('resetButton').textContent = translations[lang].resetButton;
}

function getLanguage() {
  return document.getElementById("language").value;
}

function requestNotification(firstThird, lastThird) {
  if (Notification.permission === "granted") {
    new Notification("Premier Tiers", { body: `Débute à ${firstThird.toTimeString().slice(0, 5)}` });
    new Notification("Dernier Tiers", { body: `Débute à ${lastThird.toTimeString().slice(0, 5)}` });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        requestNotification(firstThird, lastThird);
      }
    });
  }
}