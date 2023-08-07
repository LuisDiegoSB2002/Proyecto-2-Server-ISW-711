// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors
const app = express();

const port = 3001;
const { register, obtener, login, checkAdminRole, edit, deleteUser,createNewUser, obtenerXId } = require("./controlers/userController");
const {Session} = require ("./controlers/sessionController");
//const {checkAdminRole, checkUserRole} = require ("./controlers/roleController");
const {obtenerPrompts,createPrompts,editPrompts,deletePrompts,obtenerPromptsXId} = require("./controlers/promptsController");

const sendEmail = require('./controlers/emailController'); // Importa la función

mongoose.connect('mongodb://127.0.0.1:27017/proyecto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(express.json());
app.use(cors()); // Usa el middleware cors

app.post('/sendEmail', (req, res) => {
  sendEmail() // Llama a la función para enviar el correo
    .then(() => {
      res.send('Si');
    })
    .catch((error) => {
      res.status(500).send('No');
    });
});

app.use(express.json());

app.post('/register', register);

app.post('/createNewUser',Session, createNewUser);

app.get('/obtener', obtener);

app.post('/login', login);

app.put('/editUser/:id', edit );

app.delete('/deleteUser/:id',Session, deleteUser );

app.get('/deleteUser/:id', Session, deleteUser );

app.get('/obtenerXId/:id', obtenerXId);



//Request de los Prompts
app.get('/obtenerPrompts', obtenerPrompts);
app.post('/createPrompts',Session, createPrompts); 
app.patch('/editPrompts/:id',Session, editPrompts);
app.delete('/deletePrompts/:id',Session, deletePrompts);
app.get('/obtenerPromptsXId/:id', obtenerPromptsXId);



app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
