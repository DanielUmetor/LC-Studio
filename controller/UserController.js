
import express from 'express'
import bodyParser from 'body-parser'
import { users } from '../model/index.js'
import { log } from 'console'

const userRouter = express.Router()
userRouter.use(bodyParser.json())

userRouter.get('/', (req, res) => {
    users.fetchUsers(req, res)
})

userRouter.get('/:id', (req, res) => {
    users.fetchUser(req, res)
 })

 userRouter.post('/register', (req, res) => {
    users.registerUser(req, res)
 })

 userRouter.post('/login', (req, res) => {
    users.login(req, res)
 })

 userRouter.patch('/:id/update', (req, res) => {
   users.updateUser(req,res)
})

userRouter.post('/:id/addlog', (req,res) =>{
   users.addLog(req,res)
})

 export {
    userRouter,
    express
 }