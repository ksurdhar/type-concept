
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const { TEST } = require('./actions/types');
const menu = require('./main-components/menu.js');
let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.maximize()
  mainWindow.loadFile('index.html')

  Menu.setApplicationMenu(menu(mainWindow))

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

ipcMain.on(TEST, (event, arg) => { console.log('TEST RECEIVED', arg)})

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
