const http = require('http')
const { Readable } = require('stream')
const RANDOM_HTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>SSE 与 Readable Stream</title>
      </head>
      <body>
        <h1>实时数据更新</h1>
        <div id="messages"></div>
        
        <script>
          const eventSource = new EventSource('/sse');
          
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const messageDiv = document.createElement('div');
            messageDiv.textContent = \`[\${new Date().toLocaleTimeString()}] \${data.message}\`;
            document.getElementById('messages').appendChild(messageDiv);
          };
          
          eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            document.getElementById('messages').innerHTML += '<div style="color: red;">连接断开，尝试重新连接...</div>';
          };
        </script>
      </body>
      </html>
    `

// 创建自定义可读流类
class SseStream extends Readable {
  constructor (options) {
    super(options)
    this.intervalId = null
    this.isAbort = false
  }

  // 实现 _read 方法 - 当流需要数据时调用
  _read (size) {
    // 如果还没有设置定时器，则启动数据生成
    if (!this.intervalId) {
      let index = 0
      const list = RANDOM_HTML.split('\n')
      this.intervalId = setInterval(() => {
        if (index > list.length) {
          clearInterval(this.intervalId)
          this.intervalId = null
          this.isAbort = true
          // this._destroy()
        }
        const text0 = list[index]
        // const data = {
        //   message: `实时更新 (${new Date().toISOString()})`,
        //   random: Math.random()
        // }

        // 按照 SSE 格式推送数据
        const chunk = `data: ${JSON.stringify({ index, text: text0 })}\n\n`

        // 将数据推送到流中
        this.push(chunk)
        index += 1

        // 如果缓冲区已满，则暂停数据生成
        // if (isBufferFull) {
        //   clearInterval(this.intervalId);
        //   this.intervalId = null;
        //
        //   // 当缓冲区有空间时，resume 事件会被触发
        //   this.once('resume', () => {
        //     this._read(size);
        //   });
        // }
      }, 100) // 每秒生成一次数据
    }
  }

  // 实现 _destroy 方法 - 当流被销毁时调用
  _destroy (err, callback) {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    // callback(err)
  }
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 返回 HTML 页面
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>SSE 与 Readable Stream</title>
      </head>
      <body>
        <h1>实时数据更新</h1>
        <div id="messages"></div>
        
        <script>
          const eventSource = new EventSource('/sse');
          
          eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const messageDiv = document.createElement('div');
            messageDiv.textContent = \`[\${new Date().toLocaleTimeString()}] \${data.message}\`;
            document.getElementById('messages').appendChild(messageDiv);
          };
          
          eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            document.getElementById('messages').innerHTML += '<div style="color: red;">连接断开，尝试重新连接...</div>';
          };
        </script>
      </body>
      </html>
    `)
  } else if (req.url === '/api/sse') {
    // 设置 SSE 响应头

    const list = RANDOM_HTML.split('\n')
    let index = 0
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })
    const intervalId = setInterval(() => {
      if (index < list.length) {
        // 发送 HTML 片段
        res.write(`data: ${list[index]}\n\n`)
        index++
      } else {
        // 全部发送完毕后关闭连接
        clearInterval(intervalId)
        res.end()
      }
    }, 100)

    // 创建并连接可读流
    // const sseStream = new SseStream()
    // sseStream.pipe(res)

    // 客户端断开连接时销毁流
    // req.on('close', () => {
    //   sseStream.destroy()
    // })
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})

server.listen(1231, () => {
  console.log('服务器运行在 http://localhost:3000')
})
