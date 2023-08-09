const sgMail = require('@sendgrid/mail'); 

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
  const {email} = req.body;
  try {

    // Enviar correo de validación
    const msg = {
      to: 'solanodiego2002@gmail.com',
      from: 'ldsb20020611@gmail.com',
      subject: 'Validación de correo',
      text: 'Su correo a sido validado con éxito.',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    await sgMail.send(msg);

    res.status(201).json({ message: 'Usuario registrado y correo de validación enviado.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor.' });
  }
}

module.ex = sendEmail;