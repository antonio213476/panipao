// Variaveis
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { Number } = require('mongoose');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const port = 3000;


// mongo 
mongoose.connect('mongodb://127.0.0.1:27017/panipao',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
});

const usuarioSchema = new mongoose.Schema({
    email : {type : String, required: true},
    senha : {type : String, required: true}
})

const paoSchema = new mongoose.Schema({
    id_produtopao : {type : Number, required: true},
    descricao : {type : String},
    tipo : {type : String},
    dataValidade : {type : Date},
    quantidadeEstoque : {type : Number}
})

const Usuario = mongoose.model("Usuario", usuarioSchema)
const Pao = mongoose.model("ProdutoPao", paoSchema)

app.get("/", async(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/cadastro", async(req,res)=>{
    res.sendFile(__dirname+"/cadastro.html")
})

app.get("/cadastroPaniPao", async(req,res)=>{
    res.sendFile(__dirname+"/cadastroPaniPao.html")
})

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
})

app.post("/cadastro",async(req,res)=>{
    const email = req.body.email
    const senha = req.body.senha 

    if ([email,senha].some(el => el == null) ) {          
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const emailExiste = await Usuario.findOne({email:email})

    if(emailExiste) {
        return res.status(400).json({error : "Email Já Existe!"})
    }

    const usuarios = new Usuario({
        email : email,
        senha : senha,
    })

    try{
        const newUser = await usuarios.save();
        res.json({error : null, msg: "Cadastro feito com successo",userId : newUser._id})
    } catch(err) {
        res.status(400).json({err})
    }
})

app.post("/cadastroPaniPao",async(req,res)=>{
    const id_produtopao = req.body.id_produtopao
    const descricao = req.body.descricao 
    const tipo = req.body.tipo
    const dataValidade = req.body.dataValidade 
    const quantidadeEstoque = req.body.quantidadeEstoque

    if ([id_produtopao,descricao,tipo,dataValidade,quantidadeEstoque].some(el => el == null) ) {          
        console.log()
        return res.status(400).json({error : "Campos não preenchidos"})
    }

    const idExiste = await Pao.findOne({id_produtopao:id_produtopao})

    // error checks
    if(idExiste) {
        return res.status(400).json({error : "Id do produto já Existe!"})
    } else if(quantidadeEstoque > 21) {
        return res.status(400).json({error : "Limite de estoque superado!"})
    }  else if(quantidadeEstoque < 0) {
        return res.status(400).json({error : "A quantidade de estoque deve ser superior a 0 e menor que 21."})
    }

    const paes = new Pao({
        id_produtopao : id_produtopao,
        tipo : tipo,
        dataValidade : dataValidade,
        quantidadeEstoque : quantidadeEstoque,
        descricao : descricao
    })

    try{
        const newPao = await paes.save();
        res.json({error : null, msg: "Cadastro do produto feito com successo",produtoId : newPao._id})
    } catch(err) {
        res.status(400).json({err})
    }
})

