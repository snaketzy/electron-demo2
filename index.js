import { app, BrowserWindow, ipcMain } from "electron";
import os from "os";

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
    
    // let bossWin = new BrowserWindow({
    //     width: 1366,
    //     height: 768,
    //     webPreferences:{
    //         nodeIntegration: true,
    //         nodeIntegrationInSubFrames: true,
    //         contextIsolation: false,
    //         webSecurity: false
    //     },
    //     disableAutoHideCursor: true,
    //     resizable: false
    // })

    console.log("开发测试")
    console.log(os.version())
    // mainWin.webContents.setWindowOpenHandler((open) => {
       
    //     return {action:"deny"}
    // })

    mainWin.loadFile("renderer/pure/index.html")    
    // mainWin.hide()
    // bossWin.loadURL("https:/www.zhipin.com")
    // bossWin.hide()
    handleRenderer()
})

const handleRenderer = () => {
    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })
    
}