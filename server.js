require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const bodyParser  = require('body-parser'); 
const dns         = require('dns');
const app         = express();

/*
//user object
const User = {
    username  : _name;
    _id       : id;
    exercises : [];
    }

const Activity = {    
    //_id         : 0, 
    description : description;
    duration    : _duration,
    date        : _date;
    }
*/

var userList = [];

var uID = 0;

app.use(cors())
app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  
  res.sendFile(__dirname + '/views/index.html')
});

app.use(function middleware(req, res, next){
  console.log("Middleware Running");
  next();
});

app.get("/api/users/:_id/logs", function(req,res){ 
  var tempID = req.params._id; 
  console.log("===USER LOGS===");
  console.log(userList[tempID]);
  res.json(userList[tempID].exercises);
});

app.get("/api/users", function(req,res){
  console.log("Fetching User List");
  console.log(userList);

  var justUsers = [];
  userList.forEach(user => 
  justUsers.push({_id:user._id, username: user.username}));
  console.log(justUsers);
  //return userList;
  res.json(justUsers);
});

app.post("/api/users", function(req, res){
  console.log("===CREATE USER===");


  var newUser = {
    _id       : uID,
    username  : req.body.username,
    exercises : [],
    }
  uID ++;
  console.log(newUser);
  console.log(newUser.exercises);
  userList.push(newUser);
  
  res.json(newUser);  
});

app.post("/api/users/:_id/exercises", function(req,res){
  //console.log(req.params._id);
  //console.log(req.body.date);
  var _date = new Date(req.body.date);
  if(isNaN(_date.getTime())) _date = new Date();
  /*
  var activity = 
  {
    _id         : req.params._id, 
    description : req.body.description, 
    duration    : req.body.duration,
    date        : _date
  };
  */
  
  var tempID = req.params._id;
  var newActivity = {    
    //_id         : 0, 
    description : req.body.description,
    duration    : req.body.duration,
    date        : _date,
    } 
  console.log("===USER ACTIVITY===")
  console.log(newActivity);
  //Add the exercise to the user
  userList[tempID].exercises.push(newActivity);
  res.json(userList[tempID]);

});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


