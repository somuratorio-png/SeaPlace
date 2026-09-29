(function () {
  var STORAGE_KEY = 'seaplace_sponsorship';

  function getSponsorship() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function setSponsorship(item) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(item));
    } catch (e) {}
    updateCartBadge();
  }

  function clearSponsorship() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    updateCartBadge();
  }

  function updateCartBadge() {
    var has = !!getSponsorship();
    document.querySelectorAll('[data-cart-badge]').forEach(function (badge) {
      badge.textContent = has ? '1' : '0';
      badge.classList.toggle('hidden', !has);
    });
  }

  window.SeaPlaceCart = {
    getSponsorship: getSponsorship,
    setSponsorship: setSponsorship,
    clearSponsorship: clearSponsorship,
    updateCartBadge: updateCartBadge
  };

  document.addEventListener('DOMContentLoaded', updateCartBadge);
})();
