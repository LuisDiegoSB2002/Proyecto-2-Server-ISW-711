// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors
const app = express();

const port = 3001;
const { register, obtener, login, checkAdminRole, edit, deleteUser, createNewUser, obtenerXId } = require("./controlers/userController");
const { Session } = require("./controlers/sessionController");
//const {checkAdminRole, checkUserRole} = require ("./controlers/roleController");
const { obtenerPrompts, createPrompts, editPrompts, deletePrompts, obtenerPromptsXId } = require("./controlers/promptsController");



const sgMail = require('@sendgrid/mail');
require('dotenv').config();


mongoose.connect('mongodb://127.0.0.1:27017/proyecto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(express.json());
app.use(cors()); // Usa el middleware cors



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ruta para registro y envío de correo de validación
app.post('/sendEmail', async (req, res) => {
  try {

    // Enviar correo de validación
    const msg = {
      to: 'solanodiego2002@gmail.com',
      from: 'ldsb20020611@gmail.com',
      subject: 'Validación de correo',
      text: 'Su correo a sido validado con éxito.',
      html: '<strong>Su correo a sido validado con éxito.</strong>',
    };

    await sgMail.send(msg);

    res.status(201).json({ message: 'Usuario registrado y correo de validación enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});


app.use(express.json());

app.post('/register', register);

app.post('/createNewUser', Session, createNewUser);

app.get('/obtener', obtener);

app.post('/login', login);

app.put('/editUser/:id', edit);

app.delete('/deleteUser/:id', Session, deleteUser);

app.get('/deleteUser/:id', Session, deleteUser);

app.get('/obtenerXId/:id', obtenerXId);



//Request de los Prompts
app.get('/obtenerPrompts', obtenerPrompts);
app.post('/createPrompts', Session, createPrompts);
app.patch('/editPrompts/:id', Session, editPrompts);
app.delete('/deletePrompts/:id', Session, deletePrompts);
app.get('/obtenerPromptsXId/:id', obtenerPromptsXId);



app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
