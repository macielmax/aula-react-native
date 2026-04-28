const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tarefa = require('./models/Tarefa');
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(
'mongodb+srv://macielmax: fatec217@cluster.mongodb.net/?appName=Cluster0',
{ useNewUrlParser:true, useUnifiedTopology:true }
)
.then(()=>console.log('MongoDB Atlas conectado'))
.catch(err=>console.log(err));
app.post('/tarefas', async(req,res)=>{ const t=await Tarefa.create(req.body);
res.json(t) })
app.get('/tarefas', async(req,res)=>{ const t=await Tarefa.find(); res.json(t) })
app.put('/tarefas/:id', async(req,res)=>{ const t=await
Tarefa.findByIdAndUpdate(req.params.id,req.body,{new:true}); res.json(t) })
app.delete('/tarefas/:id', async(req,res)=>{ await
Tarefa.findByIdAndDelete(req.params.id); res.json({ok:true}) })
app.listen(3000,()=>console.log('Servidor rodando'));
