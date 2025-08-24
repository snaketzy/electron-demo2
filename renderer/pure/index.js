const { ipcRenderer } = require("electron")

/** 监听主进程推送 */
ipcRenderer.on('updateUserInfo', (event, value) => {
  alert(JSON.stringify(value))
})

const dataTrigger = () => {
    ipcRenderer.invoke("data-transfer","ok")
}

function showConfig() {
    // 执行逻辑
    alert("配置模块已显示！");
}

function showTargetWindow() {
  ipcRenderer.invoke("toggleTargetWindow",{windowName:"targetWin", status: "show"})
}

function hideTargetWindow() {
  ipcRenderer.invoke("toggleTargetWindow",{windowName:"targetWin", status: "hide"})
}