// Modules to control application life and create native browser window
const electron = require('electron');
const { app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');

const ipc = electron.ipcMain

/* const Menu = electron.Menu; */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let build_nssc

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow()
  mainWindow.maximize()

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

/*   const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        //{ role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click () { require('electron').shell.openExternal('https://electronjs.org') }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template) */
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

ipc.on('open-matrix-editor', function(event, args){
  build_nssc = new BrowserWindow({ width: 1040, height: 700, title: 'Plot NSSC model', parent:mainWindow, modal:true});
  build_nssc.webContents.openDevTools()


  build_nssc.loadURL(url.format({
    pathname: path.join(__dirname, './View/empty.html'),
    protocol: 'file:',
    slashes: true
  }))

  build_nssc.webContents.on('did-finish-load', () => {
    build_nssc.webContents.send('parametters-nssc', args)
  })
})

ipc.on('nssc-json-result', function(event, args){
    mainWindow.webContents.send('nssc-json-result', args)
    // build_nssc.close();
})

