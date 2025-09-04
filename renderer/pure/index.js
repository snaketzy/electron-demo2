const { ipcRenderer } = require("electron")
const tickTockStatue = false;

/** 监听主进程推送 */
ipcRenderer.on('updateUserInfo', (event, value) => {
  console.log("updateUserInfo", value)
})

/** 监听主进程推送的接口报文 */
ipcRenderer.on('responseReceived', (event, value) => {
  if(value.params.response.url.includes("userAndCompany")) {
    console.log("responseReceived", value)
    const userInfo = JSON.parse(value.response.body).data.extra
    console.log("value", userInfo)
    document.querySelector(".user-info > div:first-child > span").innerText = userInfo.realName;
    document.querySelector(".user-info > div:last-child > span").innerText = Array.isArray(userInfo.company) ? userInfo.company[0].name : userInfo.company.name;
  }
})

/** 监听主进程推送的定时器数据 */
ipcRenderer.on("updateTimer", (event, data) => {
  document.querySelector("#timer").innerText = data.value;
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

function tickTock(type) {
  if(type === "start" || "resume") {
    document.querySelector(`#${type}`).setAttribute("disabled","true");
    document.querySelector(`#pause`).removeAttribute("disabled");
    document.querySelector(`#stop`).removeAttribute("disabled");
  }
  if(type === "pause") {
    document.querySelector(`#resume`).removeAttribute("disabled");
  }
  if(type === "stop") {
    document.querySelector(`#start`).removeAttribute("disabled");
  }
  ipcRenderer.invoke("tick-tock",{status: type })
  
}