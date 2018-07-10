const express = require('express');
const vision = require('@google-cloud/vision');
const config = require('./config')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const async = require('asyncawait/async');
const await = require('asyncawait/await');
const fs = require('fs');
const Schema = mongoose.Schema;
const Person = require('./models/Person');
const client = new vision.ImageAnnotatorClient();
var app  = express();
app.use(bodyParser.json())

mongoose.Promise = Promise;

app.get('/', (req, res)=>{
    res.status(200).send('Hello, World!')
})

app.get('/image', (req,res)=>{
    var matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    fs.writeFile("./resources/out.png", matches[2], 'base64', function(err) {});

    client
    .labelDetection('./resources/out.jpg')
    .then(results => {
      const labels = results[0].labelAnnotations;
  
      console.log('Labels:');
      labels.forEach(label => console.log(label.description));
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
    res.sendStatus(200);
})

app.post('/labeldetection', (req, res)=>{
    var matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    fs.writeFile("./resources/out.png", matches[2], 'base64', function(err) {});

    client.documentTextDetection('./resources/out.png').then(response => {
        var output = "";
        var annotations = response[0].textAnnotations
        annotations.forEach(annotation => {
            output += annotation.description
        })
        res.status(200).send(output);
    }).catch(err => {});
})

app.post('/64encode', (req, res)=>{
    var matches = req.body.image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)
    fs.writeFile("./resources/out.png", matches[2], 'base64', function(err) {});
})

app.get('/person', async ((req,res)=>{
try{
    var people = await(Person.find({}, '-password -__v'));
    res.send(people);
} catch(error){
    console.error('Retrieving People Error');
    res.sendStatus(500);
}
}))

app.post('/person', (req, res) => {
    var personData = req.body

    console.log(req.body)

    var person = new Person(personData);

    person.save((err, result)=>{
        if(err)
            return res.status(500).send(err)

        res.sendStatus(200);
    })
})

mongoose.connect(config.DB_URI, {useNewUrlParser: true}).then(() => {
    console.log("Connected to Database");
    }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });

app.listen(config.PORT, ()=>{
    `Server running on ${config.PORT}`
})