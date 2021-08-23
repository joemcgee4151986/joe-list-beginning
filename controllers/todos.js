const Todo = require('../models/Todo') //Todo is a model Talks to the db

module.exports = { //exports an object. Gettodos is a property. markComplete is a function for example. 
    getTodos: async (req,res)=>{ //using async await
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id}) //run async Todo replacing db.collection deleting user id will display all of the todos people have made
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})  //count documents and stores in itemsLeft countDocument comes from mongoose. Mongoose method
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})  //takes our data and stores in the ejs
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{ //adding a todo to the collection
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id}) //req.user.id is coming from the login user. Todo.create is a mongoose method. Enable us to create a document in the db.
            console.log('Todo has been added!')
            res.redirect('/todos') //redirects to the todos page
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{ // underscore_ id means don't touch it
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile}) //findOneAndDelete comes from mongoose
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    }
}    