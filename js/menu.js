// menu.js
function openPopup(type) {
    document.getElementById(`popup-${type}`).classList.remove("hidden");
  }
  
  function closePopup(type) {
    document.getElementById(`popup-${type}`).classList.add("hidden");
  }
  
  