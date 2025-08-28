const puppeteer = require('puppeteer-core'); 
const fetch = require('node-fetch'); 


const DEBUG_PORT = 9222; 

async function getWebSocketUrl() { 
  const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`); 
  const targets = await res.json(); 
  // 根据窗口标题或URL筛选目标 
  const electronWindow = targets.find(t => t.type === 'page' && t.url.includes('viphrm.com'));
  return electronWindow.webSocketDebuggerUrl; 
}

(async () => { 
  const wsUrl = await getWebSocketUrl(); 
  console.log(wsUrl)
  return;
  const browser = await puppeteer.connect({ 
    browserWSEndpoint: wsUrl,
    dumpio: true,
    ignoreHTTPSErrors: true,
    slowMo: 100
  }); 
  console.log(await browser.version());
  const [page] = await browser.pages(); 
  // 自动化操作示例 
  await page.goto('https://example.com'); 
  await page.type('body', '自动化输入文本'); 
  await page.click('button#submit'); 
  await page.waitForNavigation(); 
  await page.pdf({ path: 'output.pdf' }); 

  await browser.disconnect(); 
})();