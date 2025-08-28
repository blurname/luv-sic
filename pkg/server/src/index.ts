import { setTimeout } from 'timers'
import { Http, Response } from 'farrow-http'

const http = Http()

http.use(async () => {
  return new Promise((resolve, reject) => {
    // setTimeout(() => {
    resolve(Response.text('Hello Farrow'))
    // }, 1000)
  })
})

http.listen(3000, () => {
  console.log('server started at http://localhost:3000')
})
