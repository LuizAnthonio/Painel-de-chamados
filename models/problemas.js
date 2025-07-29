const mongoose = require("mongoose");

const Schema = mongoose.Schema

const problemas = new Schema({
    problema: String


},{collection:"problemas"})

const Problemas = mongoose.model("problemas",problemas)

module.exports = Problemas;

     