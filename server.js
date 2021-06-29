const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '123',
    database : 'State-Transport'
  }
});

const database={users:[
  {
    username:'Dinesh Lal',
    password:'dinesh'
  },{
    username:'Hemachandar',
    password:'hema123'
  },
  {
    username:'anandhi',
    password:'9507'
  }
]}
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.listen(3001,()=>{
  console.log('app is running');
})

db.select('*').from('reg')
.then(data=>{
  console.log(data)
})

app.post('/register',(req,res)=>{
  const {
    regnamef,
    regnamel,
    regadhaarno,
    regislandercardno,
    regphone,
    pass_type,senior_citizen,student_fare,general_commuter_fare,issue_date,end_date,dob,fathername,farepaid,schoolname,schoolcode
  }=req.body;
  db('reg').returning('*').insert(
    {
     regnamef:regnamef,
     regnamel:regnamel,
     regadhaarno:regadhaarno,
     regislandercardno:regislandercardno,
     regphone:regphone,
     pass_type:pass_type,
     senior_citizen:senior_citizen,
     student_fare:student_fare,
     general_commuter_fare:general_commuter_fare,
     issue_date:issue_date,
     end_date:end_date,
     dob:dob,
     farepaid:farepaid,
     fathername:fathername,
     schoolname:schoolname,
     schoolcode:schoolcode,
   }
  )
  .then(user =>{
        res.json(user[0])
  })
  .catch(err =>{
     res.status(400).json('unable to register'+err);
  })
})


app.get('/datatable',(req,res)=>{
  db.select('*').from('reg')
  .then(data=> res.json(data))
  .catch(err=>res.json('error loading data'))
})

app.post('/search',(req,res)=>{
  db('reg').where('regadhaarno', req.body.regadhaarno)
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
})


app.post('/searchcard',(req,res)=>{
  db('reg').where('regislandercardno', req.body.regislandercardno)
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
})

app.post('/searchdate',(req,res)=>{
  db('reg').where('issue_date', req.body.issue_date)
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
})



app.get('/seniorcitizen',(req,res)=>{
  db('reg').where({
    pass_type: 'SENIOR CITIZENS'
  }).orWhere({pass_type:'Senior citizens'}).select('*')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/student',(req,res)=>{
  db('reg').where({
    pass_type: 'STUDENT'
  }).orWhere({pass_type:'Student'}).select('*')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/general',(req,res)=>{
  db('reg').where({
    pass_type: 'GENERAL COMMUTERS',
  }).orWhere({pass_type:'General Commuters'}).select('*')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/countstudent',(req,res)=>{
  db('reg').where({
    pass_type: 'Student'
  }).count('pass_type')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/countgeneral',(req,res)=>{
  db('reg').where({
    pass_type: 'General Commuters'
  }).count('pass_type')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});

app.get('/countsenior',(req,res)=>{
db('reg').count('pass_type').where({pass_type:'Senior citizens'})
.then(data=>{
  if(data){
    res.json(data)
  }
  else{
    res.status(400).json('NOT FOUND')
  }
})
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/calstudent',(req,res)=>{
  db('reg').sum('student_fare')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});

app.get('/calgeneral',(req,res)=>{
  db('reg').sum('general_commuter_fare')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/calsenior',(req,res)=>{
  db('reg').sum('senior_citizen_fare')
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});

app.post('/calseniordate',(req,res)=>{
  db('reg').sum('senior_citizen').where('issue_date',req.body.issue_date)
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});


app.get('/faretotal',(req,res)=>{
  db('reg').select(
  db.raw('sum(?? + ?? + ??) as ??', ['student_fare', 'senior_citizen_fare', 'general_commuter_fare','col'])
)
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});

app.get('/counttotal',(req,res)=>{
  db.count('pass_type').from('reg')
  .whereIn('pass_type', ['Senior citizens', 'Student', 'General Commuters'])
  .then(data=>{
    if(data){
      res.json(data)
    }
    else{
      res.status(400).json('NOT FOUND')
    }
  })
  .catch(err=>res.status(400).json('Not Found'+err))
});

app.get('/studentf',(req,res)=>{
  db.select('*').from('student')
  .then(data=>res.json(data))
})

app.get('/generalf',(req,res)=>{
  db.select('*').from('general')
  .then(data=>res.json(data))
})

app.get('/seniorf',(req,res)=>{
  db.select('*').from('senior')
  .then(data=>res.json(data))
})

app.post('/login',(req,res)=>{

          if(req.body.username===database.users[0].username && req.body.password===database.users[0].password){
            res.status(200).json('loggedin')
            res.send("success");
          }
          else if(req.body.username===database.users[1].username && req.body.password===database.users[1].password){
            res.status(200).json('loggedin')
          }
          else if(req.body.username===database.users[2].username && req.body.password===database.users[2].password){
            res.status(200).json('loggedin')
          }else{
            res.status(400).json('error logging')
          }

})
