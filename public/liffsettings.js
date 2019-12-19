window.onload = function() {
  if (liff) {
    initializeLiff();
  } else {
    alert('LIFF 載入失敗');
  }
};

/**
 * Initialize LIFF
 */
function initializeLiff() {
  liff.init(
    () => {
      initializeApp();
    },
    err => {
      alert(`LIFF載入失敗: ${JSON.stringify(err)}`);
    }
  );
}

/**
 * Initialize the app by calling functions handling individual app components
 */
function initializeApp() {
  document.getElementById('button').addEventListener('click', function() {
    liff.openWindow({
      url,
      external: true,
    });
  });
}
