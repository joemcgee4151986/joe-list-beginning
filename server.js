const express = require('express') // connecting to express??
const app = express() // allows us to connect our app
const MongoClient = require("mongodb").MongoClient
const mongoose = require('mongoose')
const PORT = 2121 // our port number
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

let db, 
    dbConnectionStr = process.env.DB_STRING, // link to our db
    dbName = 'todo'// name of the db

    MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
        .then(client => {
            console.log(`Hey, connected to ${dbName} database`) // informs us that we are connected to the database
            db = client.db(dbName)
        })
        .catch(err =>{
            console.log(err) // logging our error??
        })
        app.set('view engine', 'ejs') // connect to ejs 
        app.use(express.static('public')) //static javascript file on the client side
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json())
        app.use(logger('dev'))

        //sessions
        app.use(
            session({
              secret: 'keyboard cat', //lolwut?
              resave: false,
              saveUninitialized: false,
              store: new MongoStore({ mongooseConnection: mongoose.connection }),
            })
          )
            //passport middleware

          app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
  
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)

        app.get('/', async (req,res)=>{ // app responds with .ejs file
            const todoItems= await db.collection('todos').find().toArray()
            const itemsLeft = await db.collection('todos').countDocuments(
                {completed: false})
                res.render('index.ejs', {zebra: todoItems, left: itemsLeft})
           
            // db.collection('todos').find().toArray() //name of the database
            // .then(data =>{
            //     db.collection('todos').countDocuments({completed: false})
            //     .then(itemsLeft =>{
            //     res.render('index.ejs', {zebra: data, left: itemLeft}) // pass object to the ejs file. data is the array of objects
            
        })

            app.post('/createTodo', (req, res)=>{
               
                db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})// insert document here
            .then(result =>{
                console.log('Todo has been added!')
                res.redirect('/')
            })
            })
          // name of the link in the ejs action link

            app.put('/markComplete', (req, res)=>{
                db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  //fetches rainbowunicorn
                    $set: {
                        completed: true
                    }
        })
         .then(result =>{
             console.log('Marked Complete')
             res.json('Marked Complete')
         })   
        
        })
        app.put('/undo', (req, res)=>{
            db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{  //fetches rainbowunicorn
                $set: {
                    completed: false
                }
    })
     .then(result =>{
         console.log('Marked Complete')
         res.json('Marked Complete')
     })   
    
    })
        app.delete('/deleteTodo', (req, res)=>{
            db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn})
            .then(result =>{
                console.log('Deleted Todo')
                res.json('Deleted It')
            })
            .catch(err => console.log(err))
        })
    
    

        app.listen(process.env.PORT || PORT, () =>
        console.log('Server is running!')) // confirms our server is running
    