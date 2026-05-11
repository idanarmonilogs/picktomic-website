// platform-download.js
//
// Picks the right download for the visitor: macOS .pkg vs Windows .exe.
// Buttons opt in by setting `data-mac-url` + `data-win-url`. The first
// match wins; if neither matches we leave the existing href alone.

(function () {
  const ua = navigator.userAgent;
  const isMac = /Macintosh|Mac OS X/i.test(ua);
  const isWin = /Windows NT/i.test(ua);

  const macUrl = "https://drive.google.com/open?id=1FCZodPQifcwa67mid6RV0vNBShpthDTj";
  const winUrl = "https://drive.google.com/open?id=1AjOmPFTe43OXK9CP4f2bn-Lggnqtg52v";

  function tag(label) {
    if (isMac) return label.replace(/Try [Ff]ree.*/, "Try Free for macOS");
    if (isWin) return label.replace(/Try [Ff]ree.*/, "Try Free for Windows");
    return label;
  }

  document.querySelectorAll('a[href*="drive.google.com/open?id=1FCZodPQifcwa67mid6RV0vNBShpthDTj"]')
    .forEach((a) => {
      const labelEl = a.querySelector(".btn-label") || a;
      if (isWin) {
        a.href = winUrl;
        // re-label sub-text if any
        if (labelEl) labelEl.textContent = tag(labelEl.textContent.trim());
      } else if (isMac) {
        if (labelEl) labelEl.textContent = tag(labelEl.textContent.trim());
      }
      // else: leave as macOS default + label unchanged
    });
})();
