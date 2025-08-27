const defaultSession = session.defaultSession;

  // ✅ 拦截请求并修改请求头
  defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://api.example.com/*'] },
    (details, callback) => {
      details.requestHeaders['Authorization'] = 'Bearer token123'; // 添加认证头
      details.requestHeaders['Custom-Header'] = 'ModifiedValue';
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  // ✅ 拦截响应并修改内容（需重新发起请求）
  defaultSession.webRequest.onHeadersReceived(
    { urls: ['https://api.example.com/data'] },
    (details, callback) => {
      // 用 Node.js 重新发起请求以获取响应体
      const request = net.request({
        url: details.url,
        method: details.method,
        headers: details.requestHeaders
      });

      let responseData = Buffer.from('');
      request.on('response', (response) => {
        response.on('data', (chunk) => {
          responseData = Buffer.concat([responseData, chunk]);
        });
        response.on('end', () => {
          // ✅ 修改响应体（示例：在 JSON 中添加字段）
          const modifiedData = JSON.parse(responseData.toString());
          modifiedData.injectedByElectron = true;
          const newData = JSON.stringify(modifiedData);

          // ✅ 修改响应头（如解决跨域）
          const headers = details.responseHeaders;
          headers['Access-Control-Allow-Origin'] = ['*'];

          callback({
            responseHeaders: headers,
            statusLine: 'HTTP/1.1 200 OK',
            data: Buffer.from(newData).toString('base64') // 需返回 base64
          });
        });
      });
      request.end();
    }
  );