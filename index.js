import path from 'path'
import cors from 'cors'
import { userRouter, express } from './controller/UserController.js' 
import { errorHandling } from './middleware/errorHandling.js'


const app = express()
const port = +process.env.PORT || 4000


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Request-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Expose-Headers", "Authorization")
    next()
  })
  app.use('/users', userRouter)
  app.use(
    express.static("./static"),
    express.json(),
    express.urlencoded({
      extended: true
      }),
      cors()
  )

app.get('^/$|/home', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'))
})
app.get('*', (req, res) => {
    res.json({
        status: 404,
        msg: '❌ Resource not found.'
    })
})
app.use(errorHandling)
app.listen(port, () => {
    console.log(`Live on port: ${port}`)
})


