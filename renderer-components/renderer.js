var getCaretCoordinates = require('textarea-caret');
const { ipcRenderer } = require('electron');
const path = require('path')
const { 
  OPEN_DOCUMENT, 
  INITIATE_SAVE, 
  INITIATE_NEW_FILE,
  RENDERER_SENDING_SAVE_DATA
} = require(path.resolve('./actions/types'))

const { debounce } = require(path.resolve('./renderer-components/debounce'))

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');

    // textArea.style.fontFamily = 'Lora'
    // textArea.style.fontSize = '18px'

    textArea.style.fontFamily = 'Merriweather'
    textArea.style.fontSize = '16px'

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

    function resizeAndRecenter(evt, animate) {
      resize()
      setTimeout(recenter(animate), 200)
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
      const textHeight = parseInt(text.style.height.slice(0, -2))
      if (textHeight !== clonedText.scrollHeight && clonedText.scrollHeight !== 0) {
        console.log('resizing')
        text.style.height = clonedText.scrollHeight + 'px';
      }
      offScreen.removeChild(clone);
    }

    function recenter(animate = false) {
      var text = document.getElementById('text');
      var coordinates = getCaretCoordinates(text, text.selectionEnd);
      var container = document.getElementById('container');
      if (text.scrollHeight !== text.clientHeight) {
         // copy paste bug
        console.log('uh oh - scrollheight does not match clientheight!')
      } 

      const options = { top: coordinates.top }
      if (animate) {
        options.behavior = 'smooth'
      }
      container.scrollTo(options)
    }

    // timeouts are necessary on certain events, it would seem
    function conditionalRnR(evt) {
      clickCued = false
      if (allowClick) {
        setTimeout(resizeAndRecenter.bind(null, null, true), 1)
      } 
      else {
        allowClick = true
      }
    }

    function delayedResizeAndRecenter(evt) {
      clickCued = false
      setTimeout(resizeAndRecenter.bind(null, null, true), 1)
    }

    // different debounce intervals for different interactions
    const debouncedClick = debounce(conditionalRnR, 200)
    const debouncedDblClick = debounce(delayedResizeAndRecenter, 100)

    const fastDebounced = debounce(delayedResizeAndRecenter, 50)


    // on mousedown, if there is a click cued, prevent

    let allowClick = true
    let clickCued = false // set back to false when click action finishes or on cancel
    textArea.addEventListener('click', () => {
      console.log('click')
      clickCued = true
      debouncedClick()
    })

    textArea.addEventListener('mousedown', () => {
      if (clickCued) {
        allowClick = false
      }
      console.log('mousedown')
    })

      textArea.addEventListener('dblclick', () => {
      console.log('dblclick')
      debouncedDblClick()
    })

    textArea.addEventListener('input', resizeAndRecenter)
    // textArea.addEventListener('mouseup', debouncedResize)
    textArea.addEventListener('keydown', fastDebounced)
    textArea.addEventListener('blur', () => { textArea.focus() })

    textArea.focus()
  }
}