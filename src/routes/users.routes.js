const express = require('express');
const router = express.Router();
const usersModel = require('../models/users.model');

// get users
router.get('/', /* verifyRole.admin, */ (req, res) => {
  usersModel.getUsers()
    .then(users => {
      users.forEach(user => {
        delete user['password']
      });
      res.status(200).json({
        success: true,
        message: 'all users.',
        users
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});

// create user
router.post('/new',/*  verifyRole.teacher, */ async (req, res) => {
  const {
    name,
    lastName,
    email,
    password,
    rol
  } = req.body;
  const user = {
    name,
    lastName,
    email,
    password,
    rol,
    state: 'active'
  }

  console.log('Creando nuevo usuario');
  user.password = await helpers.encyptPassword(user.password);

  usersModel.createUser(user)
    .then(newUser => {
      console.log({
        newUser: newUser.code
      })

      // check if the user exist on the db
      if (newUser.code == 'ER_DUP_ENTRY') {
        console.log(newUser)
        res.status(500).json({
          success: false,
          message: newUser.sqlMessage
        });
      } else {

        // if the user is not on the db we create it
        user.user_id = newUser.insertId;
        delete user['password'];
        res.status(200).json({
          success: true,
          message: 'User created successfully.',
          newUser: user
        });
      }

    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.sqlMessage
      });
    });
});

module.exports = router;