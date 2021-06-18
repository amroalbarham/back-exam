'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/digimon', { useNewUrlParser: true, useUnifiedTopology: true });

const digimonSchema = new mongoose.Schema({
    name: String,
    img: String,
    level: String,
})
const digimonModel = mongoose.model('poki', digimonSchema);

const server = express();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;


server.get('/getData', getDataHandler);
server.post('/senDataTo', senDataToHandler);
server.get('/getDataServer',getDataServerHandler);
server.delete('/deletData/:id',deletDataHandler);
server.put('/finalData/:id',finalDataHandler);

function getDataHandler(req, res) {
    const url = `https://digimon-api.vercel.app/api/digimon`;
    axios.get(url).then(result => {
        const DigimonArray = result.data.map((digimon, idx) => {
            // console.log(digimon);
            return new Digimon(digimon);
        })
        res.send(DigimonArray);
    })
}
function senDataToHandler(req, res) {
    // console.log(req.body);
    const { name, img, level } = req.body;
    const newdigimon = new digimonModel({
        name: name,
        img: img,
        level: level,
    })
    newdigimon.save();
}
function getDataServerHandler(req,res) {
    digimonModel.find({},(error,data)=>{
        res.send(data);
    })
}
function deletDataHandler(req,res) {
    // console.log(req.params);
    const id =req.params.id
    digimonModel.remove({_id:id},(error,data)=>{
        digimonModel.find({},(error,newData)=>{
            res.send(newData);
        })
    })
    
}
function finalDataHandler(req,res) {
    const id =req.params.id;
    const {nameDigimon,imgDigimon,levelDigimon}=req.body;
        digimonModel.findOne({_id:id},(error,data)=>{
            data.name= nameDigimon;
            data.img= imgDigimon;
            data.level=  levelDigimon;
            data.save().then(()=>{
                digimonModel.find({},(error,newData)=>{
                    res.send(newData);
                })
            })
        })
}








class Digimon {
    constructor(digimon) {
        this.name = digimon.name;
        this.img = digimon.img;
        this.level = digimon.level;
    }
}


server.listen(PORT, () => {
    console.log(`listening from ${PORT}`);
})





//asdfasdfasdfadsfasdfasdf

