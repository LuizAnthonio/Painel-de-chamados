const mongoose = require("mongoose")

const Schema = mongoose.Schema

const user = new Schema({
    nome: String,
    funcao:String,
    email: String,
    senha: String,


},{collection:"user"})

const User = mongoose.model("user",user)

module.exports = User;