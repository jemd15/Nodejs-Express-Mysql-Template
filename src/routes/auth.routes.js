const express = require('express');
const router = express.Router();
const authModel = require('../models/auth.models');
const jwt = require('jsonwebtoken');
const helpers = require('../libs/helpers');

router.get('/', (req, res) => {
  res.send(200).json({
    success:true,
    message: 'API works!'
  });
});

router.post('/login', (req, res) => {
  const {
    email,
    password
  } = req.body;
  const login = {
    email,
    password
  }

  authModel.getUserByEmail(login.email)
    .then(userFound => {
      if(userFound[0].state == 'active'){
        helpers.matchPassword(login.password, userFound[0].password)
        .then((success) => {
          if(success){
            delete userFound[0].password;
            const token = jwt.sign({ userFound }, process.env.SECRET);
            userFound[0].token = token;
            res.status(200).json({
              success: true,
              message: 'Loggin success.',
              user: userFound[0]
            });
          }else {
            res.status(401).json({
              success: false,
              message: 'Password wrong.'
            });
          }
        })
        .catch(err => {
          console.error(err)
          res.status(401).json({
            success: false,
            message: 'Email or password wrong.'
          });
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'User blocked by the Administrator.'
        })
      }
    })
    .catch(err => {
      res.status(401).json({
        success: false,
        message: 'Email or password wrong.'
      });
    });
});

module.exports = router;