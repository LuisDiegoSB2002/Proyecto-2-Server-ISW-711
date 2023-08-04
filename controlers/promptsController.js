const User = require("../models/userModel");
const Prompts = require("../models/PromptsModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';
const express = require('express');



  const createPrompts = async (req, res) => {
    const { name, tipo, idUser , etiquetas } = req.body;
    
    try {
      // Verificar si ya existe un usuario con el mismo correo electrónico
      const existingPrompts = await Prompts.findOne({ name });
      
      if (existingPrompts) {
        return res.status(200).json({ error: 'El nombre del Prompts ya está en uso' });
      }
  
      // Crear un nuevo Prompts
      
      const newPrompts = new Prompts({
        name,
        tipo,
        idUser,
        etiquetas
      });
  
      await newPrompts.save();
  
      res.status(200).json({ message: 'Prompts registrado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al registrar el Prompts' });
    }
  }
  

  const checkAdminRole = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado. Se requiere el rol de administrador.' });
    }
    next();
  };

  const editPrompts = async (req, res) => {
    
    const userId = req.params.id;
    
    const { name, tipo , etiquetas } = req.body;
  
    try {
      // Verificar si el usuario existe en la base de datos
      const prompts = await Prompts.findById(userId);
      if (!prompts) {
        return res.status(404).json({ error: 'El prompts no existe' });
      }
  
      // Actualizar los datos del usuario
      prompts.name = name;
      prompts.tipo = tipo;
      prompts.etiquetas = etiquetas;
    
      await prompts.save();
  
      res.status(200).json({ message: 'Prompts actualizado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al actualizar el prompts' });
    }
  }
  const deletePrompts = async (req, res) => {
    const promptsId = req.params.id;
  
    try {
      // Verificar si el usuario existe en la base de datos
      const prompts = await Prompts.findById(promptsId);
      if (!prompts) {
        return res.status(404).json({ error: 'El usuario no existe' });
      }
  
      // Eliminar el usuario
      await prompts.deleteOne();
  
      res.status(200).json({ message: ' Prompts eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el Prompts' });
    }
  }


  const obtenerPrompts = async (req, res) => { 
    try {
      // Obtener todos los usuarios de la base de datos
      const prompts = await Prompts.find({});
  
      res.status(200).json(prompts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al obtener los prompts' });
    }
  }

  const obtenerPromptsXId = async (req, res) => {
    const promptsId = req.params.id;

  try {
    // Obtener el usuario de la base de datos por su ID
    const prompts = await Prompts.findById(promptsId);

    if (!prompts) {
      return res.status(404).json({ error: 'Prompts no encontrado' });
    }

    res.status(200).json(prompts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el Prompts por su ID' });
  }
    
    
  }
  module.exports = {createPrompts,editPrompts,deletePrompts,obtenerPrompts,obtenerPromptsXId};