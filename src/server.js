const express = require("express")
const app = express()
const fs = require("fs")
const cors = require("cors")
const path = require("path")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")


const connectDatabase = () =>{
    console.log('Esperando conexão');
    
    
    mongoose.connect("SEUBANCODEDADOS",{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log('Mongo Conectado Com SUCESSO!')).catch((error)=> console.log(error))
}

connectDatabase();

app.use(session({ secret: 'upaPajucara', 
  cookie: { maxAge: 60000 },
}))


app.use((req, res, next) => {
  res.locals.baseUrl = req.baseUrl;
  next();
});

app.use(express.static(path.join(__dirname, '../public'), {
  index: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}))



app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname,'../views'));  

app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const agente = require("../routes/Agente")
const usuario = require("../routes/Usuario")

app.use("/",agente)
app.use("/",usuario)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


