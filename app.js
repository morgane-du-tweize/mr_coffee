const {users} = require("./data.js");
const {schedules} = require("./data.js");

const express = require("express");
const app = express();
const jpv = require('jpv');
const port = 3000 ;
var createError = require('http-errors');
var path = require('path');
const { request } = require("http");
const bcrypt = require('bcrypt');
const saltRounds = 10;


app.use(express.urlencoded({extended: true}));

app.get('/', (request, response) => {
    response.send("Welcome to our schedule website");
})

app.get('/users', (request, response) => {
    response.send(users);
})

app.get('/schedules', (request, response) => {
    response.send(schedules);
})

app.get('/users/:id', function(request, response){
    if (request.params.id <0 || request.params.id >= users.length){
        response.status(404);
        response.end('This user does not exist');
    }
    else {
        var idRep = request.params.id ;
        response.send(users[idRep]);

    }
})

app.get('/users/:id/schedules', function(request, response){
    if (request.params.id <0 || request.params.id >= users.length){
        response.status(404);
        response.end('This user does not exist');
    }

    else {
        var scheduleExist = false ;
        var result =  [];
        var idRep = request.params.id ;
        for (var schedulId of schedules){
            
            if (idRep == schedulId["user_id"]){
                scheduleExist = true ;
                result.push(schedulId);
            }
        }
        if (scheduleExist){
            response.send(result);
        }

        else {
            response.status(404);
            response.end('This user does not exist');
        }
    }
})

app.post('/schedules', function(request, response)  {

    var newSchedule = request.body ;

    var schedulPattern = {
        user_id: '(number)',
        day: '(number)',
        start_at: '(alphaNumeric)',
        end_at: '(alphaNumeric)'
    };
        
    if (jpv.validate(newSchedule, schedulPattern)) {
        schedules.push(newSchedule);
        response.send(newSchedule);
    }

    else { response.send("Please enter a proper schedule");
    }

})

app.post('/users', function(request, response)  {

    var newUsData = request.body ;
    console.log(newUsData);

    var userPattern = {
        firstname: '(string)',
        lastname: '(string)',
        email: '(email)',
        password: '(alphaNumeric)'
    };

   
    if (newUsData.firstname && newUsData.lastname && newUsData.email && newUsData.password) {    

        var newuser = {firstname: newUsData["firstname"], lastname: newUsData["lastname"], email: newUsData["email"]};

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(newUsData["password"], salt);

        newuser["password"] = hash;

        // transformer mon objet en json
        var newuser = JSON.stringify(newuser);

        // ajouter le json aux résultats
        users.push(newuser);
        response.send(newuser);
    }

    else { response.send("Please enter a proper schedule");
    }

})


app.listen(port, function() {
    console.log(`Example app listening at http://localhost:${port}`);
  })
