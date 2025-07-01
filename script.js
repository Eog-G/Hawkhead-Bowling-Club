document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  // Defensive check to make sure all elements exist
  if (!menuButton || !mobileMenu || !menuIcon || !closeIcon) {
    console.error("Navigation menu elements not found on the page.");
    return;
  }

  menuButton.addEventListener('click', () => {
    // Toggle the .is-open class on the mobile menu itself
    mobileMenu.classList.toggle('is-open');

    // Toggle which icon is shown by adding/removing the generic .hidden utility class
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
  });
});
