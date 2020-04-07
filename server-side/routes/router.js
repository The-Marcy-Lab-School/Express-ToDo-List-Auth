const express = require('express')
const listController = require('../controllers/to-do-query')
const userController = require('../controllers/user-controller')
const toDoList = require('../models/to-do-list')
const router = express.Router()
const pool = require('../../db')
const authenticate = require('../auth/verify') 
const path = require('path')

//API paths
router.get('/login', userController.login)
router.post('/register', userController.register)
router.get('/incomplete-tasks', authenticate, listController.getAllIncompletedTasks)
router.get('/completed-tasks', authenticate, listController.getAllCompletedTasks)
router.get('/tasks', authenticate, listController.getAllTasks)
router.post('/add-task', authenticate, toDoList.addTask)
router.delete('/delete-task/:id', authenticate, toDoList.deleteTask)
router.put('/update-task/:id', authenticate, toDoList.updateTask)
router.put('/complete-task/:id', authenticate, toDoList.completeTask)

//Client side paths
router.get('/', (req, res) =>{
    res.sendFile(path.join(__dirname ,'../../views' , 'index.html'))
})

router.get('/register-page', (req, res) =>{
    res.sendFile(path.join(__dirname ,'../../views' , 'register.html'))
})

router.get('/login-page', (req, res) =>{
    res.sendFile(path.join(__dirname ,'../../views' , 'login.html'))
})

router.get('/to-do-list', (req, res) =>{
    res.sendFile(path.join(__dirname ,'../../views' , 'to-do-list.html'))
})

router.get('/add-task-page', (req, res) =>{
    res.sendFile(path.join(__dirname ,'../../views' , 'add-task.html'))
})

router.get('/update-task/:id', (req, res) =>{
    const id = req.params
    res.render('update-task.ejs', {taskId: id})
})


module.exports = router