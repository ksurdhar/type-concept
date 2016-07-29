var CaretCoordinates = require('textarea-caret-position');

document.onreadystatechange = function() {
  if (document.readyState == 'interactive') {
    var textArea = document.getElementById('text');
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
      var currentRow = ((coordinates.top - 4) / 14);
      textarea.style.top = `${222 - (14 * currentRow)}px`;

      // make the textarea unscrollable. The inner container should be scrollable?
      // always have the next row rendered. Start with two rows.
      // make the background transparent

      console.log('--------------------------------------');
      console.log('COORDINATES: ', coordinates);
      console.log('TOTAL ROWS:', textarea.rows);
      console.log('CURRENT ROW: ', currentRow);
      // console.log('HEIGHT: ', textarea.style.height);
    }
    textArea.addEventListener("input", onInputHandler);

    // var maxCharCount;
    // var hiddenTextArea = document.getElementById('fake');
    // function calculateRowChars() {
    //   var baseScrollHeight = hiddenTextArea.scrollHeight;
    //   while(hiddenTextArea.scrollHeight === baseScrollHeight) {
    //     hiddenTextArea.value += 'a';
    //     if(hiddenTextArea.scrollHeight > baseScrollHeight) {
    //       console.log('MAX CHARS', maxCharacters);
    //       return maxCharacters
    //     }
    //     maxCharacters = hiddenTextArea.value.length;
    //   }
    // }
    // maxCharCount = calculateRowChars();
  }
}
