const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';
const express = require('express');