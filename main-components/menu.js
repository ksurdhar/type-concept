const { app, Menu, dialog } = require('electron')
const path = require('path')
const { OPEN_DOCUMENT } = require(path.resolve('./actions/types'))

var fs = require('fs');

module.exports = function(window){
  let currentFilePath

  function openFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err);
      console.log('DATA', data)
      currentFilePath = path
      console.log('SETTING FILE PATH VAR TO', currentFilePath)
      window.webContents.send(OPEN_DOCUMENT, data)
    });
  }

  // function saveFile() {
  //   fs.writeFile(currentFilePath,)
  // }

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
              properties: ['openFile'], filters: [{ name: 'Text Files', extensions: ['txt'] }] 
            }, (fileData) => {
              console.log('FILE', fileData[0])
              openFile(fileData[0])
            })
          } 
        },
        { 
          label: `Save`, click: () => {
            dialog.showOpenDialog({ 
              properties: ['openFile'], filters: [{ name: 'Text Files', extensions: ['txt'] }] 
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