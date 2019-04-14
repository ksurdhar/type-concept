var CaretCoordinates = require('textarea-caret-position');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    var CoordinateHelper = new CaretCoordinates(textArea);

    function resizeAndRecenter(evt) {
      setTimeout(resize(), 10);
      recenter()
    }

    function resize() {
      // create offscreen clone
      var text = document.getElementById('text');
      var offScreen = document.getElementById('offscreen');
      var clone = text.cloneNode(false);
      clone.style.position = 'absolute';
      clone.style.left = '-999em';
      offScreen.appendChild(clone);

      // determine if resize necessary
      clone.style.height = 'auto';
      if (text.style.height !== clone.scrollHeight && clone.scrollHeight !== 0) {
        text.style.height = clone.scrollHeight+'px';
      }
      offScreen.removeChild(clone);
    }

    function recenter() {
      var text = document.getElementById('text');
      var coordinates = CoordinateHelper.get(text.selectionStart, text.selectionEnd);
      var container  = document.getElementById('container');
      container.scrollTo({top: coordinates.top, behavior: 'smooth'})
    }

    function onPointerDown(evt) {
      setTimeout(resizeAndRecenter, 10)
    }

    function onKeyDown(evt) {
      setTimeout(resizeAndRecenter, 10)
    }

    textArea.addEventListener("input", resizeAndRecenter);
    textArea.addEventListener('pointerdown', onPointerDown);
    textArea.addEventListener('keydown', onKeyDown);
  }
}