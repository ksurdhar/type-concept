var getCaretCoordinates = require('textarea-caret');
const { ipcRenderer } = require('electron');
const path = require('path')
const { 
  OPEN_DOCUMENT, 
  INITIATE_SAVE, 
  INITIATE_NEW_FILE,
  RENDERER_SENDING_SAVE_DATA
} = require(path.resolve('./actions/types'))

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    // textArea.style.fontFamily = 'Lora'
    // textArea.style.fontSize = '18px'

    textArea.style.fontFamily = 'Merriweather'
    textArea.style.fontSize = '17px'

    ipcRenderer.on(OPEN_DOCUMENT, (event, data) => { // when saved show notification on screen
      textArea.value = data
      textArea.setSelectionRange(0,0)
      setTimeout(resize, 1)
    })

    ipcRenderer.on(INITIATE_SAVE, (event, data) => {
      ipcRenderer.send(RENDERER_SENDING_SAVE_DATA, textArea.value, data.saveAs)
    })

    ipcRenderer.on(INITIATE_NEW_FILE, (event, data) => {
      textArea.value = ''
      textArea.setSelectionRange(0,0)
      setTimeout(resize, 1)
    })

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

    // timeouts are necessary on certain events, it would seem
    function delayedResizeAndRecenter(evt) {
      setTimeout(resizeAndRecenter, 1)
    }

    textArea.addEventListener('input', resizeAndRecenter);
    textArea.addEventListener('pointerdown', delayedResizeAndRecenter);
    textArea.addEventListener('keydown', delayedResizeAndRecenter);
    textArea.addEventListener('blur', () => { textArea.focus() })
    textArea.focus()
  }
}