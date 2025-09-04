import { 
  app, 
  BrowserWindow,
  ipcMain, 
  Menu, 
  shell,
  session,
  net,
  screen
} from "electron";
import os from "os";
import url from "url";
import path from "path";
import GetHttpData from "./GetHttpData.js";



let mainWin;
let targetWin;
let __filename = url.fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);


let timer = null;
let timerValue = 0;

// 启用调试端口 
app.commandLine.appendSwitch('remote-debugging-port', '9222');

app.on("ready", () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
    const windowWidth = Math.floor(screenWidth / 2); // 窗口宽度为屏幕宽度的一半
    const windowHeight = Math.floor(screenHeight * 0.75); // 窗口高度为屏幕高度的3/4，可根据需要调整
    const windowX = Math.floor(windowWidth / 3); // x坐标设置为0，即紧贴屏幕左边缘
    const windowY = Math.floor((screenHeight - windowHeight) / 2); // 计算y坐标以使窗口在垂直方向上居中

    mainWin = new BrowserWindow({
      x: windowX,
      y: windowY,
      width: 1280,
      height: 200,
      webPreferences:{
          nodeIntegration: true,
          nodeIntegrationInSubFrames: true,
          contextIsolation: false,
          webSecurity: false,
          allowRunningInsecureContent: true
      },
      resizable: false
    })

    console.log("开发测试")
    console.log(os.version())
    
    mainWin.loadFile("renderer/pure/index.html")
    createTargetWindow()
    // targetWin.loadURL("https://premoss.viphrm.com") 

    console.log("主进程")
   
    mainWin.on('move', () => {
      // 为避免性能问题，限制更新频率，例如使用防抖
      clearTimeout(mainWin.moveTimeout);
      mainWin.moveTimeout = setTimeout(() => {
        updateSecondWindowPosition();
      }, 10); // 100毫秒防抖
    });
    
    handleRenderer()
    createMenu()
})

// 更新窗口B位置的函数
const updateSecondWindowPosition = () => {
  if (!mainWin || mainWin.isDestroyed()) return;
  if (!targetWin || targetWin.isDestroyed()) return;

  const mainPosition = mainWin.getPosition();
  const mainSize = mainWin.getSize();

  // 计算窗口B的新位置
  const newX = mainPosition[0];
  const newY = mainPosition[1] + mainSize[1];

  // 设置窗口B的位置
  targetWin.setPosition(newX, newY);
}

const createTargetWindow = () => {
  const mainWinPosition = mainWin.getPosition();
  const mainWinSize = mainWin.getSize();
  const targetWinX = mainWinPosition[0];
  const targetWinY = mainWinPosition[1] + mainWinSize[1];

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
    autoHideMenuBar:true,
    frame: false,
    show: false,
    showInactive: true,
    resizable: false
  })
  targetWin.setPosition(targetWinX, targetWinY);
  GetHttpData(targetWin,mainWin)
}


/** 处理渲染进程 */
const handleRenderer = () => {
    ipcMain.handle("data-transfer" ,(event,data) => {
        console.log("data:", data)
    })

    /** 监听渲染进程的toggleTargetWindow通知 */
    ipcMain.handle("toggleTargetWindow",(event, data) => {
      if(data.status === "show") {
        targetWin.showInactive()
      } else {
        targetWin.hide()
      }
    })

    /** 监听渲染进程的定时器通知 */
    ipcMain.handle("tick-tock", (event,data ) => {
      startTimer(data.status)
    })

    ipcMain.handle("fetch-response",(event, data) => {
      debugger
      console.log(data)
    })
}


const startTimer = (status) => {
  if(timer && status === "start") return;
  if(status === "start") {
    timer = setInterval(() => {
      timerValue ++;
      mainWin.send("updateTimer",{ value: timerValue})
    }, 1000)
  }
  if(status === "pause") {
    clearInterval(timer)
  }
  if(status === "stop"){
    clearInterval(timer)
    timerValue = 0
  }
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

