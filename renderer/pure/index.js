const { ipcRenderer } = require("electron")

const dataTrigger = () => {
    ipcRenderer.invoke("data-transfer","ok")
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