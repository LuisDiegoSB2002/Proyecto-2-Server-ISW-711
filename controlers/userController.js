const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';
const express = require('express');


const register = async (req, res) => {
  const { name, email,phone, password } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(200).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Crear un nuevo usuario con el rol "user"
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      estado: 'inactivo',
    });

    await newUser.save();

    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}
const createNewUser = async (req, res) => {
  const { name, email,phone, password, role, estado } = req.body;

  try {
    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser) {
      return res.status(200).json({ error: 'El correo electrónico ya está en uso' });
    }

    // Crear un nuevo usuario con el rol "user"
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      estado
    });

    await newUser.save();

    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
}
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar si la contraseña es correcta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar un token JWT con la información del usuario
    const token = jwt.sign({ userId: user._id, role: user.role, phone: user.phone }, secretKey);

    res.json({
      message: "Validacón completada....",
      token: token,
      name: user.name,
      role: user.role,
      phone: user.phone

    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

const checkAdminRole = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso no autorizado. Se requiere el rol de administrador.' });
  }
  next();
};

const edit = async (req, res) => {

  const userId = req.params.id;
  const { name, email,phone, password, rol, estado } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Actualizar los datos del usuario
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.password = password;
    user.rol = rol;
    user.estado = estado;

    if (password) {
      // Si se proporciona una nueva contraseña, encriptarla y guardarla
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
}
const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe' });
    }

    // Eliminar el usuario
    await user.deleteOne();

    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
}


const obtener = async (req, res) => {
  try {
    // Obtener todos los usuarios de la base de datos
    const users = await User.find({}, '-password'); // Excluir el campo de contraseña de la respuesta

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }


}
const obtenerXId = async (req, res) => {
  const userId = req.params.id;

  try {
    // Obtener el usuario de la base de datos por su ID
    const user = await User.findById(userId, '-password'); // Excluir el campo de contraseña de la respuesta

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el usuario por su ID' });
  }


}
module.exports = { register, obtener, login, checkAdminRole, edit, deleteUser, createNewUser, obtenerXId };