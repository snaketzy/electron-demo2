const { app, BrowserWindow, ipcMain } = require("electron");

let mainWin;
let bossWin;
app.on("ready", () => {
    let mainWin = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences:{
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false
        }
    })
    
    let bossWin = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences:{
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false,
            webSecurity: false
        },
        disableAutoHideCursor: true,
        resizable: false
    })

    console.log("开发测试")
    // mainWin.webContents.setWindowOpenHandler((open) => {
       
    //     return {action:"deny"}
    // })

    mainWin.loadURL("https://www.bing.com")    
    mainWin.hide()
    bossWin.loadURL("https:/www.zhipin.com")
    bossWin.show()
})