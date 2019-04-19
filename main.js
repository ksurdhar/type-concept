
const { app, BrowserWindow, Menu, dialog } = require('electron')
let mainWindow
var fs = require('fs');

function openFile(path) {
  fs.readFile(path, 'utf8', function (err, data) {
    if (err) return console.log(err);
    // data is the contents of the text file we just read
    console.log('DATA', data)
  });
}


function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.maximize()
  mainWindow.loadFile('index.html')

  Menu.setApplicationMenu(Menu.buildFromTemplate([
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
]))


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
