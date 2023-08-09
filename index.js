// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors
const app = express();
const jwt = require('jsonwebtoken');
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
  const { email } = req.body;
  try {
    // Genera un token de validación
    const token = jwt.sign({ email }, 'secreto-seguro', { expiresIn: '1h' }); // Personaliza el secreto y el tiempo de expiración
    
    // Crea la URL de validación
    const validationUrl = `http://tu-aplicacion.com/validateEmail?token=${token}`;

    // Enviar correo de validación con la URL
    const msg = {
      to: email,
      from: 'ldsb20020611@gmail.com',
      subject: 'Validación de correo',
      text: `Por favor, haga clic en el siguiente enlace para validar su correo electrónico: ${validationUrl}`,
      html: `<p>Por favor, haga clic en el siguiente enlace para validar su correo electrónico:</p><a href="${validationUrl}">Validar correo</a>`,
    };

    await sgMail.send(msg);

    res.status(201).json({ message: 'Usuario registrado y correo de validación enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

// Ruta para manejar la validación del correo
app.get('/validateEmail', (req, res) => {
  const { token } = req.query;
  try {
    const decodedToken = jwt.verify(token, 'secreto-seguro'); // Verifica el token usando el mismo secreto

    // Realiza acciones de validación, como actualizar el estado de validación en la base de datos
    // ...

    res.send('Correo electrónico validado correctamente.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al validar el correo electrónico.');
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
