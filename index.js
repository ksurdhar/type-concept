var getCaretCoordinates = require('textarea-caret');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    // textArea.style.fontFamily = 'Lora'
    // textArea.style.fontSize = '18px'

    textArea.style.fontFamily = 'Merriweather'
    textArea.style.fontSize = '17px'

    function resizeAndRecenter(evt) {
      resize()
      recenter()
    }

    function resize() {
      // create offscreen clone
      var text = document.getElementById('text');
      var offScreen = document.getElementById('offscreen');
      var container = document.getElementById('container')
      var clone = container.cloneNode(true);
      clone.style.left = '-999em';
      offScreen.appendChild(clone);
      
      // determine if resize necessary
      var clonedText = offscreen.getElementsByTagName('textarea')[0];
      clonedText.style.height = 'auto';
      if (text.style.height !== clonedText.scrollHeight && clonedText.scrollHeight !== 0) {
        text.style.height = clonedText.scrollHeight + 'px';
      }
      offScreen.removeChild(clone);
    }

    function recenter() {
      var text = document.getElementById('text');
      var coordinates = getCaretCoordinates(text, text.selectionStart);
      var container = document.getElementById('container');
      if (text.scrollHeight !== text.clientHeight) {
         // copy paste bug
        console.log('uh oh - scrollheight does not match clientheight!')
      } 
      container.scrollTo({ top: coordinates.top, behavior: 'smooth' })
    }

    function onPointerDown(evt) {
      setTimeout(resizeAndRecenter, 1)
    }

    function onKeyDown(evt) {
      setTimeout(resizeAndRecenter, 1)
    }

    textArea.addEventListener('input', resizeAndRecenter);
    textArea.addEventListener('pointerdown', onPointerDown);
    textArea.addEventListener('keydown', onKeyDown);
    textArea.addEventListener('blur', () => { textArea.focus() })
    textArea.focus()
  }
}