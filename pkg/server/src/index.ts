import { Http, Response } from 'farrow-http'
import { cors } from 'farrow-cors'
import { Stream } from 'stream'

const http = Http()
http.use(cors())

const testHTml = `
<html><head><title>追忆</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/dear.png"><script defer="" src="/static/js/lib-polyfill.js"></script><script defer="" src="/static/js/lib-react.js"></script><script defer="" src="/static/js/vendors-node_modules_localforage_dist_localforage_js-node_modules_remesh-react_cjs_index_js-n-d2b59c.js"></script><script defer="" src="/static/js/index.js"></script><link href="/static/css/index.css" rel="stylesheet"></head>
  <body>
    <div id="root"><div class="App" style="box-sizing: border-box; overflow: hidden;"><div>StreamTest</div></div></div>
<div id=":r5:" data-floating-ui-portal=""></div></body></html>
`

http.listen(1231, () => {
  console.log('server started at http://localhost:1231')
})

http.get('/api/test')
  .use(() => {
    return Response.json({
      code: 1,
      message: 'api/test'
    })
  })

http.get('/api/stream-html')
  .use(() => {
    return Response.headers({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })
    .stream(
      new Stream.Readable({
        read (100) {
          this.push('string1')
          this.push('null')
        }
      })
    )
  })
