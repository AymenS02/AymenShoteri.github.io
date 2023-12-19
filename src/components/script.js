document.addEventListener("DOMContentLoaded", function() {
    const firstH3 = document.querySelector('nav-bar-h3-name');
    
    if(firstH3) {
      firstH3.addEventListener('click', function() {
        location.reload(); // Reloads the page when .first-h3 is clicked
      });
    }
  });