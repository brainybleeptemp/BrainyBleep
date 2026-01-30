document.addEventListener('DOMContentLoaded', () => {
  const profileNameEl = document.getElementById('profile-name');
  const badgeSelect = document.getElementById('badge-select');
  const badgeDisplay = document.getElementById('badge-display');
  const profileImg = document.getElementById('profile-img');
  const profilePicInput = document.getElementById('profile-pic-input');
  const saveBtn = document.getElementById('save-profile-btn');

  // Load saved profile
  const savedName = localStorage.getItem('studentName');
  if (savedName) profileNameEl.textContent = `Welcome, ${savedName} 👋`;

  const savedBadge = localStorage.getItem('studentBadge');
  if (savedBadge) {
    badgeSelect.value = savedBadge;
    badgeDisplay.textContent = savedBadge;
  }

  const savedImg = localStorage.getItem('studentProfileImg');
  if (savedImg) profileImg.src = savedImg;

  // Update badge display when selected
  badgeSelect.addEventListener('change', () => {
    badgeDisplay.textContent = badgeSelect.value;
  });

  // Update profile image
  profilePicInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      profileImg.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // Save profile
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('studentBadge', badgeSelect.value);
    localStorage.setItem('studentProfileImg', profileImg.src);
    alert('Profile saved!');
  });
});
// ========================
// STREAK BABY SYSTEM
// ========================

const petFlame = document.getElementById("pet-flame");
const petMood = document.getElementById("pet-mood");
const petStage = document.getElementById("pet-stage");
const petNameInput = document.getElementById("pet-name-input");
const savePetNameBtn = document.getElementById("save-pet-name");
const petNameDisplay = document.getElementById("pet-name-display");

let streak = parseInt(localStorage.getItem("streak")) || 0;
let lastQuestDate = localStorage.getItem("lastQuestDate");

function updatePetVisual() {
  const today = new Date().toDateString();
  let mood = "Happy";
  let stage = "Spark";
  let flame = "🔥";

  if (lastQuestDate !== today) {
    mood = "Low energy";
    flame = "💤";
  }

  if (streak >= 7) {
    stage = "Legend Flame";
    flame = "💙🔥";
  } else if (streak >= 5) {
    stage = "Neon Flame";
  } else if (streak >= 3) {
    stage = "Bright Flame";
  } else if (streak >= 1) {
    stage = "Warm Spark";
  }

  petFlame.textContent = flame;
  petMood.textContent = `Mood: ${mood}`;
  petStage.textContent = `Stage: ${stage}`;
}

savePetNameBtn.addEventListener("click", () => {
  const name = petNameInput.value.trim();
  if (!name) return;
  localStorage.setItem("petName", name);
  petNameDisplay.textContent = `Name: ${name}`;
  petNameInput.value = "";
});

function loadPetName() {
  const savedName = localStorage.getItem("petName");
  if (savedName) {
    petNameDisplay.textContent = `Name: ${savedName}`;
  }
}

updatePetVisual();
loadPetName();
