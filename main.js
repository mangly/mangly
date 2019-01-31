// Modules to control application life and create native browser window
const electron = require('electron');
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const ipc = electron.ipcMain

const Menu = electron.Menu;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1600, height: 800 })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './View/hidden-sidebar.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  //mainWindow.maximize()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  createWindow()
  Menu.setApplicationMenu(null);
})


// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('open_matrix_editor', function(event, args){
  let build_nssc = new BrowserWindow({ width: 1024, height: 768, title: 'Plot NSSC model'});
  build_nssc.webContents.openDevTools()


  build_nssc.loadURL(url.format({
    pathname: path.join(__dirname, './View/form-components.html'),
    protocol: 'file:',
    slashes: true
  }))

  build_nssc.webContents.on('did-finish-load', () => {
    build_nssc.webContents.send('variable', args)
  })
})

