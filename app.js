//Questo è un progetto di test per API REST

//importing delle dependencies
const Hapi = require("hapi");
const Joi = require("joi");
const Mongoose = require("mongoose");

//Inizializzazione server Hapi.js
const server = new Hapi.Server({ "host": "localhost", "port": 3000 });

//Connesione con il database
Mongoose.connect("mongodb+srv://simlarosa:74666399sSs@apitest-a0slg.mongodb.net/test?retryWrites=true",
 {useNewUrlParser: true}, (err) => {
     if(err) {
         console.log(err);
     } else {
         console.log('Connected to Database');
     }
 });

//Create the model in database

const PersonModel = Mongoose.model("person", {
    firstname: String,
    lastname: String
});

//CRUD API

//CREATE

server.route({
    method: "POST",
    path: "/person",
    options: {
        validate: {
            payload: {
                firstname: Joi.string().min(3).required(),
                lastname: Joi.string().required() 
            }
        }
    },
    handler: async (request, h) => {
        try{
            console.log("Try to Add a Person in POST API");
            var person = new PersonModel(request.payload);
            var result = await person.save();
            return h.response(result);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
});

server.route({
    method: "GET",
    path: "/people",
    handler: async (request, h) => {
        try{
            console.log("See all the Person in the database");
            var people = await PersonModel.find().exec();
            h.response(people).source.forEach(person => {
                console.log(person.firstname + " " + person.lastname);
            });
            return h.response(people);
        } catch (error) {
            return h.response(error).code(500);
        }
    }
})

server.start();

