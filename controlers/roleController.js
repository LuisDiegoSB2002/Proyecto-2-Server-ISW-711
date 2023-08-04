const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';
const express = require('express');


  const checkAdminRole = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso no autorizado. Se requiere el rol de administrador.' });
    }
    next();
  };
  const checkUserRole = (req, res, next) => {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Acceso no autorizado. Se requiere el rol de user.' });
    }
    next();
  };
  module.exports = {checkAdminRole, checkUserRole};