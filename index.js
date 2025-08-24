import { app, BrowserWindow, ipcMain, Menu, shell } from "electron";
import os from "os";

let mainWin;
app.on("ready", () => {
    mainWin = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences:{
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false
        }
    })
    
    console.log("开发测试")
    console.log(os.version())
    
    mainWin.loadFile("renderer/pure/index.html")    
    
    handleRenderer()
    createMenu()
})

/** 处理渲染进程 */
const handleRenderer = () => {
    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })
}

setTimeout(() => {
  mainWin.webContents.send("updateUserInfo",{user:"test"})
}, 1000)


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