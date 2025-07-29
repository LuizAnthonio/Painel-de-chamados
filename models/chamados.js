const mongoose = require("mongoose");

const Schema = mongoose.Schema

const chamados = new Schema({
    unidade: String,
    problema: String,
    local:String,
    data: String,
    status: String,
    peso: Number,
    prioridade:String,
    dataFinalizacao:String,
    quemFinalizou:String

},{collection:"chamados"})

const Chamados = mongoose.model("chamados",chamados)

module.exports = Chamados;

     