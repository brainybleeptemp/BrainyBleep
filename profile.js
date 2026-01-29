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
