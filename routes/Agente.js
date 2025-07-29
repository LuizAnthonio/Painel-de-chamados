const mongoose = require("mongoose")
const express = require("express")
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const User = require("../models/user")
const Chamados = require("../models/chamados")
const Unidades = require("../models/unidades")
const session = require("express-session")


app.use(bodyParser.urlencoded({ extended: true })); // Para formulários HTML
app.use(bodyParser.json()); // Para requisições JSON

router.get("/", async (req,res) => {

    if(req.session.login){

        res.redirect("/chamados")

    }else{

        res.render("index")
    }


})

router.get("/cadastrar", async (req,res) => {
    
    
    res.render("cadastro")
})

router.get("/chamados", async (req,res) => {
    
    if(req.session.login){
        res.render("suporte",req.session.login)

    }else{
        res.redirect("/")
    }
    
    
})


router.get("/cadastrar/unidade", async (req, res) => {
    
     if(req.session.login){

        
         res.render("cadastroUnidade",req.session.login)
     }else{
        res.redirect("/")
     }
    
})

router.post("/cadastrar/unidade", async (req, res) => {
    
    console.log(req.body)
    
    const { nome,salas } = req.body;
    
    const dados = { unidade:nome,salas }
    
    await Unidades.create(dados)
    
    res.json({ok:"success"})
})


router.post("/", async (req,res) => {
    
    const {email,senha} = req.body
    console.log({email,senha})
    
    const user = await User.findOne({email:email})
    req.session.login = {user:user.nome,id:user._id}

    console.log(user)

    res.json({ok:true,user:user.nome})
 

})




router.post("/api/chamados/0", async (req,res) => {
    const {unidade} = req.body;
    let chamados;


    if(unidade != "all"){
        chamados = await Chamados.find({unidade:unidade})
    }else{
        chamados = await Chamados.find()
    }




    console.log(unidade)
    res.json(chamados)

})

router.put("/api/chamados/1", async (req,res) => {

    const {id, statusChamado} = req.body;
    console.log({id, statusChamado})

    await Chamados.updateOne({_id:id}, {$set:{status:statusChamado}})

    res.json("ok")
})

router.post("/", async (req,res) => {
    const {email, senha } = req.body;

    console.log(email,senha)

    res.render("index")
    
})


router.post("/cadastrar", async (req,res) => {
    const {nome, email, senha } = req.body;

    let use = {}
    use.nome = nome
    use.funcao = "Agente interativo"
    use.email = email
    use.senha = senha

    console.log(use)

    if(User.find({email:use.email})){
        User.create(use)
        res.redirect("/")
    }else{

        res.render("cadastro")
    }

  
    
})


module.exports = router