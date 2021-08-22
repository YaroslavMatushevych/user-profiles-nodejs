const express = require('express');
const router = express.Router();

// Create custom homepage
// --------------------------------------------------
router.get('/', function(req, res, next) {
  const users = req.app.locals.users;

  users.find().limit(15).toArray((err, recent) => {
    console.log(recent)

    res.render('index', { recent } );
  });
});
// --------------------------------------------------

module.exports = router;
