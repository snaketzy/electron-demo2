import { 
  app, 
  BrowserWindow,
  ipcMain, 
  Menu, 
  shell,
  session,
  net
} from "electron";
import os from "os";
import url from "url";
import path from "path";
import GetHttpData from "./GetHttpData.js";



let mainWin;
let targetWin;
let __filename = url.fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

// 启用调试端口 
app.commandLine.appendSwitch('remote-debugging-port', '9222');

app.on("ready", () => {
    mainWin = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences:{
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            contextIsolation: false,
            webSecurity: false,
            allowRunningInsecureContent: true
        },
        resizable: false
    })

    targetWin = new BrowserWindow({
        width: 1280,
        height: 768,
        webPreferences:{
            webSecurity:false,
            nodeIntegration: true,
            contextIsolation: true,
            nodeIntegrationInSubFrames: true,
            allowRunningInsecureContent: true,
            preload: path.join(__dirname, "renderer/preload.mjs")
        },
        x: 0,
        autoHideMenuBar:true,
        frame: false,
        // show: false,
        resizable: false
    })

    console.log("开发测试")
    console.log(os.version())
    
    mainWin.loadFile("renderer/pure/index.html")   
    // targetWin.loadURL("https://premoss.viphrm.com") 

    console.log("主进程")
    GetHttpData(targetWin,mainWin)
    
    handleRenderer()
    createMenu()
})

/** 处理渲染进程 */
const handleRenderer = () => {
    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })

    ipcMain.handle("toggleTargetWindow",(event, data) => {
      if(data.status === "show") {
        targetWin.show()
      } else {
        targetWin.hide()
      }
    })

    ipcMain.handle("fetch-response",(event, data) => {
      debugger
      console.log(data)
    })
}


setTimeout(() => {
  // debugger
  // mainWin.webContents.send("updateUserInfo",{user:"test"})
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

