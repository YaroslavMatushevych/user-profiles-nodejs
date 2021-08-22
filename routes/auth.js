const express = require('express');
const router = express.Router();
const authUtils = require('../utils/auth');
const passport = require('passport');
const upload = require("../utils/multer");
const flash = require('connect-flash');

// Create login page
// --------------------------------------------------
router.get('/login', (req, res, next) => {
  const messages = req.flash();
  res.render('login', { messages });
});
// --------------------------------------------------


// Handle login request
// --------------------------------------------------
router.post('/login', passport.authenticate('local', 
  { failureRedirect: '/auth/login', 
    failureFlash: 'Wrong email or password'}), (req, res, next) => {
  res.redirect('/users');
});
// --------------------------------------------------


// Create register page
// --------------------------------------------------
router.get('/register', (req, res, next) => {
  const messages = req.flash();
  res.render('register', { messages });
});
// --------------------------------------------------


// Handle register request
// --------------------------------------------------
router.post('/register', upload.single("image"), (req, res, next) => {
  const registrationParams = req.body;
  const users = req.app.locals.users;
  const payload = {
    email: registrationParams.email,
    firstName: registrationParams.first,
    lastName: registrationParams.last,
    password: authUtils.hashPassword(registrationParams.password),
    img: req.file.filename,
  };

  users.insertOne(payload)
    .then((result) => {
      if(result && result.insertedId) {
        const id = result.insertedId;
        console.log(result, result.insertedId);
        req.flash('success', 'User account registered successfully.');  
        res.status(200).json({ id: id })
      }
    })
    .catch((err) => {
      req.flash('error', 'User account already exists.');
    })
});
// --------------------------------------------------

// Logout page
// --------------------------------------------------
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;