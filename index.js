// index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importa el módulo cors
const app = express();
const jwt = require('jsonwebtoken');
const port = 3001;
const { register, obtener, login, checkAdminRole, edit, deleteUser, createNewUser, obtenerXId, editProfile, changePasword } = require("./controlers/userController");
const { Session } = require("./controlers/sessionController");
//const {checkAdminRole, checkUserRole} = require ("./controlers/roleController");
const { obtenerPrompts, createPrompts, editPrompts, deletePrompts, obtenerPromptsXId } = require("./controlers/promptsController");

const User = require("../Proyecto-2-Server-ISW-711/models/userModel");

const sgMail = require('@sendgrid/mail');

require('dotenv').config();
const accountSid = process.env.TU_ACCOUNT_SID;
const authToken = process.env.TU_AUTH_TOKEN;
const verifySid = process.env.TU_VERIFY_SERVICE_SID;

const client = require('twilio')(accountSid, authToken);




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
    const validationUrl = `http://localhost:3000/validarEmail/${token}`;


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
app.get('/validarEmail', async (req, res) => {
  const { token } = req.query;
  try {
    const decodedToken = jwt.verify(token, 'secreto-seguro'); // Verifica el token usando el mismo secreto


    const user = await User.findOne({ email: decodedToken.email });
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Actualizar los datos del usuario
    user.estado = "Activa";
    await user.save();

    res.send('Correo electrónico validado correctamente.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al validar el correo electrónico.');
  }
});



app.post('/sendVerificationCode', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    // Enviar el código de verificación por SMS utilizando v2 de Twilio
    const verification = await client.verify.services(verifySid).verifications.create({
      to: phoneNumber,
      channel: 'sms'
    });


    console.log(verification.status); // Imprimir el estado de la verificación (puede ser "pending" o "approved")

    res.status(201).json({ message: 'Código de verificación enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});


app.post('/verifyCode', async (req, res) => {
  const { phoneNumber, code } = req.body;

  try {
    // Verificar el código de verificación ingresado por el usuario
    const verificationCheck = await client.verify.services(verifySid).verificationChecks.create({
      to: phoneNumber,
      code: code
    });

    console.log(verificationCheck.status); // Imprimir el estado de la verificación (puede ser "approved" o "pending")

    if (verificationCheck.status === 'approved') {
      res.status(200).json({ message: 'Verificación exitosa.' });
    } else {
      res.status(400).json({ message: 'Código de verificación incorrecto.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
});

app.get('/activaValidacion', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Actualizar los datos del usuario
    user.validacion = "Activa";
    await user.save();

    res.send('Validació de 2 pasos activada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al activar la validación de 2 pasos');
  }
});

app.get('/desactivaValidacion', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Actualizar los datos del usuario
    user.validacion = "Inactiva";
    await user.save();

    res.send('Validació de 2 pasos desactivada');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al deasactivar la validación de 2 pasos');
  }
});


app.use(express.json());

app.post('/register', register);

app.post('/createNewUser', Session, createNewUser);

app.get('/obtener', obtener);

app.post('/login', login);

app.patch('/editUser/:id', edit);

app.delete('/deleteUser/:id', Session, deleteUser);

app.get('/deleteUser/:id', Session, deleteUser);

app.get('/obtenerXId/:id', obtenerXId);



//Request de los Prompts
app.get('/obtenerPrompts', obtenerPrompts);
app.post('/createPrompts', Session, createPrompts);
app.patch('/editPrompts/:id', Session, editPrompts);
app.delete('/deletePrompts/:id', Session, deletePrompts);
app.get('/obtenerPromptsXId/:id', obtenerPromptsXId);

//Request de los Profile
app.patch('/editProfile/:id', editProfile);
app.patch('/changePasword/:id', changePasword);

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
