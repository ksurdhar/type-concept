var CaretCoordinates = require('textarea-caret-position');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    var CoordinateHelper = new CaretCoordinates(textArea);

    function resizeAndRecenter(evt) {
      resize();
      recenter();
    }

    function resize() {
      text = document.getElementById('text');
      text.style.height = 'auto';
      text.style.height = text.scrollHeight+'px';
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