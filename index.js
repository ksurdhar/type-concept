var CaretCoordinates = require('textarea-caret-position');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    var container = document.getElementById('container');
    var baseScrollHeight = textArea.scrollHeight;
    var CoordinateHelper = new CaretCoordinates(textArea);

    function onInputHandler(evt) {
      console.log('on input')
			var newRows = Math.ceil((this.scrollHeight - baseScrollHeight) / 14);
			this.rows = 1 + newRows;
      this.style.height = this.rows*14 + 'px'; // this changes the height based upon our rows
      recenter(this);
    }

    function recenter(textarea) {
      var coordinates = CoordinateHelper.get(textarea.selectionStart, textarea.selectionEnd);
      // 14px per row, top starts at 4px
      // 222px is the alignment line
      var currentRow = ((coordinates.top - 4) / 14);
      textarea.style['top'] = `${212 - (14 * currentRow)}px`;

      // once the textarea's top is 0, start scrolling instead of repositioning
      // just ensure that the height of the text area is no more than what takes up
      // the top of the screen to the middle, activated line.

      // this way we have a scroll bar and ought to be able to scroll up to the top if necessary.
      // when typing 
      console.log('recentering:')
      console.log('--------------------------------------');
      console.log('SELECTION START', textarea.selectionStart);
      console.log('SELECTION END', textarea.selectionEnd);
      // console.log('COORDINATES: ', coordinates);
      // console.log('TOTAL ROWS:', textarea.rows);
      // console.log('CURRENT ROW: ', currentRow);
      // console.log('HEIGHT: ', textarea.style.height);
    }

    function onPointerDown(evt) {
      setTimeout(recenter.bind(this, this), 10)
    }

    function onKeyDown(evt) {
      console.log('keydown!')
      // setTimeout(() => {
      //   console.log('firing nowww')
      //   recenter(this)
      // }, 10)
      setTimeout(recenter.bind(this, this), 10)
    }
    textArea.addEventListener("input", onInputHandler);
    textArea.addEventListener('pointerdown', onPointerDown)
    textArea.addEventListener('keydown', onKeyDown)
    

    // attempt to make top scrollable
    // var topString = textarea.style.top;
    // var top = Number(topString.substring(0, topString.length - 2));
    // if (top < 0) {
    //   debugger
    //   textarea.style['margin-top'] = -top + 'px';
    // }
  }
}

// given the current row and the height, position the text area via top or margin top
// instead of/
