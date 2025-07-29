const mongoose = require("mongoose")
const express = require("express")
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const Chamados = require("../models/chamados")
const Unidades = require("../models/unidades")

const valores = [
    {problema:"Digital não está pegando",peso:5},
    {problema:"PED no adulto",peso:4},
    {problema:"Painel não está chamando",peso:4},
    {problema:"Não Acho paciente",peso:5},
    {problema:"Adulto na PED",peso:4},
    {problema:"Impressora",peso:2},
    {problema:"Outro",peso:1},
    

]

function calculaPeso(str){

    for(let i in valores){
        if(str === valores[i].problema){
            return valores[i].peso
        }else{
            return 3

        }


    }



}

function mostraPrioridade(peso){
    switch(peso){
        case 1: 
            return "baixo"
        case 2: 
            return "media"
        case 3: 
            return "media"
        case 4: 
            return "alta"
        case 5: 
            return "alta"
    }

}





router.get("/", async (req,res) => {
    res.render("index")

})

router.get("/chamado/:unidade", async (req,res) => {
    let unidade = req.params.unidade.toLocaleUpperCase()
    const unidades = await Unidades.find({unidade:unidade})

    if(unidades){

        console.log(unidades)
        res.render("usuario",{unidade:unidade,tudo:unidades[0].salas})
    }else{
        res.render("naoecontrada")
    }


})

router.post("/api/chamado", async (req,res) => {
    //const unidade = req.params.unidade.toLocaleUpperCase()
    const { problema, unidadeSelec, local,data, unidade } = req.body
    let obj = { problema, unidadeSelec, local, data }

    obj.status = "pendente"
    obj.peso = calculaPeso(obj.problema)
    obj.prioridade = mostraPrioridade(obj.peso)
    obj.unidade = unidadeSelec


    console.log(obj)

    await Chamados.create(obj)


    res.json({ problema, unidadeSelec, local })
})








module.exports = router