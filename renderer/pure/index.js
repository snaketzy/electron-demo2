const { ipcRenderer } = require("electron")

/** 监听主进程推送 */
ipcRenderer.on('updateUserInfo', (event, value) => {
  alert(JSON.stringify(value))
})

const dataTrigger = () => {
    ipcRenderer.invoke("data-transfer","ok")
}

const updateUserInfo = () => {
    ipcRenderer.invoke("updateUserInfo","ok")
}

function showConfig() {
    // 执行逻辑
    alert("配置模块已显示！");
}

async function hideIframe () {
  document.getElementById("content-iframe").style.display = "none"

}

const showIframe = () => {
  document.getElementById("content-iframe").style.display = "block"
}