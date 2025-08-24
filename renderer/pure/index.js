const { ipcRenderer } = require("electron")

const dataTrigger = () => {
    ipcRenderer.invoke("data-transfer","ok")
}
function showConfig() {
    // 执行逻辑
    alert("配置模块已显示！");
}


async function toggleTheme () {
    return await ipcRenderer.invoke("toggleTheme")
}