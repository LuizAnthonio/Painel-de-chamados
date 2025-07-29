const mongoose = require("mongoose");

const Schema = mongoose.Schema

const unidades = new Schema({
    unidade: String,
    salas: Array


},{collection:"unidades"})

const Unidades = mongoose.model("unidades",unidades)

module.exports = Unidades;

     