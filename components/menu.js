const { app, Menu, dialog } = require('electron')
const path = require('path')
const { OPEN_DOCUMENT } = require(path.resolve('./actions/types'))

var fs = require('fs');

module.exports = function(window){
  function openFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err);
      // data is the contents of the text file we just read
      console.log('DATA', data)
      window.webContents.send(OPEN_DOCUMENT, data)
      // ipcRenderer.send(OPEN_DOCUMENT, { text: data })
    });
  }

  return Menu.buildFromTemplate([
    {
      label: `Engine`,
      submenu: [
        { label: `Open Devtools`, accelerator: "cmd+alt+i", role: 'toggledevtools' },
        { label: `Quit`, click: () => app.quit() }
      ]
    },
    {
      label: `File`,
      submenu: [
        { 
          label: `Open`, click: () => {
            dialog.showOpenDialog({ 
              properties: ['openFile'], 
              filters: [{ name: 'Text Files', extensions: ['txt'] }] 
            }, (fileData) => {
              console.log('FILE', fileData[0])
              openFile(fileData[0])

            })
          } 
        }
      ]
    }
  ])
}