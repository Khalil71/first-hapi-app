const hapi = require('hapi');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/hapidb', (err)=>{
  if(err) throw err;
  console.log(`connected to mongo`)
})

//create model
const Task = mongoose.model('Task', {text:String});
//init server
const  server = new hapi.Server();


server.connection({
  port:8000,
  host:'localhost'
});
//basic routing
server.route({
  method:'GET',
  path:'/',
  handler: (req, res) => {
    //res(`<h1>Hello world<h1>`);
    res.view('index', {
      name:`Mohamed Kahlil`
    });
  }
});
//daynamic routing
server.route({
  method:'GET',
  path:'/user/{name}',
  handler: (req, res) => {
    res(`Hello ` + req.params.name);
  }
});
//render a html file
server.register(require('inert'), (err) => {
  if(err) throw err;
  server.route({
    method:'GET',
    path:'/about',
    handler: (req, res) => {
      res.file(`./public/about.html`);
    }
  });
})
//render an image
server.register(require('inert'), (err) => {
  if(err) throw err;
  server.route({
    method:'GET',
    path:'/image',
    handler: (req, res) => {
      res.file(`./public/happy.png`);
    }
  });
})

// vision templates
server.register(require('vision'), (err) => {
  if(err) throw err;
  server.views({
    engines:{
      html:require('handlebars')
    },
    path:__dirname + '/views'
  })
})
//tasks route
server.route({
  method:'GET',
  path:'/tasks1',
  handler: (req, res) => {
    //res(`<h1>Hello world<h1>`);
    res.view('tasks', {
      tasks:[{text:'Mohamed Kahlil'}, {text:'task2'}, {text:'task3'}]
    });
  }
});
//get tasks route the data in mongo
server.route({
  method:'GET',
  path:'/tasks',
  handler: (req, res) => {
    let tasks = Task.find({}, (err, tasks)=> {
      // console.log(tasks);
      res.view('tasks', {
        tasks:tasks
      })
    })
    //res(`<h1>Hello world<h1>`);
    // res.view('tasks', {
    //   tasks:[{text:'Mohamed Kahlil'}, {text:'task2'}, {text:'task3'}]
  }
});
//get tasks route
server.route({
  method:'POST',
  path:'/tasks',
  handler: (req, res) => {
    let text = req.payload.text;
    let newTask = new Task({text:text});
    newTask.save((err, task)=>{
      if(err) return console.log(err);
      return res.redirect().location('tasks');
    })
      }
});
server.start((err) => {
  if(err) throw err;

  console.log(`server started at: ${server.info.uri}`);
});
