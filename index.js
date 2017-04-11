var CaretCoordinates = require('textarea-caret-position');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
    var container = document.getElementById('container');
    var baseScrollHeight = textArea.scrollHeight;
    var CoordinateHelper = new CaretCoordinates(textArea);

    function onInputHandler(evt) {
			var newRows = Math.ceil((this.scrollHeight - baseScrollHeight) / 14);
			this.rows = 1 + newRows;
      this.style.height = this.rows*14 + 'px';
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

      console.log('--------------------------------------');
      // console.log('COORDINATES: ', coordinates);
      // console.log('TOTAL ROWS:', textarea.rows);
      // console.log('CURRENT ROW: ', currentRow);
      // console.log('HEIGHT: ', textarea.style.height);
    }
    textArea.addEventListener("input", onInputHandler);

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
