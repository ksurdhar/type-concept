const { app, Menu, dialog, ipcMain } = require('electron')
const path = require('path')
const { 
  OPEN_DOCUMENT, 
  INITIATE_SAVE, 
  RENDERER_SENDING_SAVE_DATA 
} = require(path.resolve('./actions/types'))

var fs = require('fs');

module.exports = function(window){
  let currentFilePath

  function sendFileToRenderer(path) {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) return console.log(err);
      currentFilePath = path
      window.webContents.send(OPEN_DOCUMENT, data)
    });
  }

  ipcMain.on(RENDERER_SENDING_SAVE_DATA, (event, data, saveAs) => {
    if (currentFilePath && saveAs === false) {
      fs.writeFile(currentFilePath, data, (err, data) => {
        if (err) return console.log(err);
        console.log('saved existing file!')
      })
    } else {
      // break out for saving new file
      dialog.showSaveDialog({ filters: [{
        name: 'Text Files',
        extensions: ['txt']
      }]}, (fileNameAndPath) => {
        if (!fileNameAndPath) {
          console.log('user cancelled action')
          return
        }
        // update state
        currentFilePath = fileNameAndPath

        const writeStream = fs.createWriteStream(fileNameAndPath)
        writeStream.once('open', () => {
          writeStream.write(data)
          writeStream.end()
          console.log('finished writing!')
        })
      })
    }
  })

  // function saveFile() {
    // fs.writeFile(currentFilePath,)
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
        // add entry for new file
        { 
          label: `Open`, click: () => {
            dialog.showOpenDialog({ 
              properties: ['openFile'], filters: [{ name: 'Text Files', extensions: ['txt'] }] 
            }, (fileData) => {
              if (!fileData) {
                console.log('user cancelled action')
                return
              }
              sendFileToRenderer(fileData[0]) // file path
            })
          }
        },
        { 
          label: `Save`, accelerator: "cmd+s", click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: false })
          } 
        },
        { 
          label: `Save As...`, accelerator: "shift+cmd+s", click: () => {
            window.webContents.send(INITIATE_SAVE, { saveAs: true })
          } 
        }
      ]
    }
  ])
}