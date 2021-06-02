require('dotenv').config()
const express     = require('express')
const cors        = require('cors')
const bodyParser  = require('body-parser'); 
const dns         = require('dns');
const app         = express();
const uniqID      = require('uniqid');
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
var testData = 
{
  username: "Leo",
  _id :"test",
  log : [
  {
    description: 'running in the 90s',
    duration: 61,
    date: new Date("1990-01-01")
  },
  { 
    description: 'core', 
    duration: 62, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 63,
    date: new Date()
  },
    { 
    description: 'core', 
    duration: 64, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 65,
    date: new Date()
  },
    { 
    description: 'core', 
    duration: 66, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 67,
    date: new Date()
  },  { 
    description: 'core', 
    duration: 68, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 69,
    date: new Date()
  },
    { 
    description: 'core', 
    duration: 70, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 71,
    date: new Date()
  },  { 
    description: 'core', 
    duration: 73, 
    date: new Date() 
    },
  {
    description: 'squats',
    duration: 74,
    date: new Date()
  },
  ]
};
var userList = [testData];

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
/*
app.get("/api/users/:_id/logs", function(req,res){ 
  console.log("===USER LOGS===");
  var fetchedUser = findUser(req.params._id);
  fetchedUser.count = fetchedUser.log.length;
  res.json(fetchedUser);
});
*/
app.get("/api/users/:_id/logs/:from?/:to?/:limit?", function(req,res){ 
  console.log("===USER LOGS MORE LIMITS===");
  var fetchedUser = findUser(req.params._id);
  //console.log(fetchedUser);
  var logData = fetchedUser.log;

  var from = new Date(req.params.from);
  var to = new Date(req.params.to); 
  var limit = parseInt(req.params.limit);
  //console.log("LOG DATA PRE");
  //console.log(logData);
  if(!isNaN(from))
      logData = logData.filter(data => {return data.date > from});    
  
  if (!isNaN(to))
      logData = logData.filter(data => {return data.date < to});
    /*
    limitedLogData = limitedLogData.filter(function(exerciseItem){ 
        return (exerciseItem.date > from && exerciseItem.date < to);
      });
    */
      //console.log("PRUNING LIMITS");
    if(!isNaN(limit)){
        var i = 0;
        logData = logData.filter(item => {if(i <limit){
        i++; 
        return item;
      }});
    }
    console.log("LOG DATA POST");
    console.log(logData);
    var retVal = {
      id        : fetchedUser._id,
      username  : fetchedUser.username,
      log       : logData,
      count     : parseInt(logData.length)
      }
    console.log(retVal);
      console.log(req.params);
    res.json(retVal);
    
});

function isBetween(itemDate, fromDate, toDate)
{
  return (itemDate > fromDate && itemDate <toDate);
}

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
    _id       : uniqID(),
    username  : req.body.username,
    log : [],
    }
  console.log(newUser);
  userList.push(newUser);
  
  res.json(newUser);  
});

app.post("/api/users/:_id/exercises", function(req,res){
  //console.log(req.params._id);
  //console.log(req.body.date);
  var _date = new Date(req.body.date);
  if(isNaN(_date.getTime())) _date = new Date();
  var fetchedUser = findUser(req.params._id);

  var newActivity = {    
    description : req.body.description,
    duration    : parseInt(req.body.duration),
    date        : _date.toDateString(),
  }
  console.log("===USER ACTIVITY===");
  //Add the exercise to the user
  fetchedUser.log.push(newActivity);
  console.log (fetchedUser);
  console.log (findUser(req.params._id));
  
  res.json({
    _id : req.params._id,
    username : fetchedUser.username,
    description : req.body.description,
    duration : parseInt(req.body.duration),
    date : _date.toDateString()
  });

});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


function findUser(userId)
{
  //var profile = userList.find(target => target._id === userId);
  return userList.find(target => target._id === userId);
}