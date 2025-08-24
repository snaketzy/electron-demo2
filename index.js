import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
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
    createMenu()
})

const handleRenderer = () => {
    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })
    
}

/** 创建菜单 */
const createMenu = () => {
  let template = [
    {
      label:"工具",
      submenu: [
        {
          label:"刷新(F5)",
          accelerator:"F5",
          click:(item, focusedWindow) => {
            if(focusedWindow) {
              focusedWindow.reload()
            }
          } 
        },
        {
          label:"切换开发者工具(F12)",
          accelerator:"F12",
          click:(item, focusedWindow) => {
            if(focusedWindow) {
              focusedWindow.webContents.toggleDevTools()
            }
          }
        }
      ]
    },
    {
      label:"帮助",
      submenu: [
        {
          label:"关于(F1)",
          accelerator:"F1",
          click:() => {
            shell.openExternal("https://premoss.viphrm.com/")
          }
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}