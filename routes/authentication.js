const User = require('../models/user'); // Import User Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = function(router)  {

  //Registration
  router.post('/register', function(req, res){
    if (!req.body.email) {
      res.json({ success: false, message: 'You must provide an e-mail' });
    } else {
      if (!req.body.username) {
        res.json({ success: false, message: 'You must provide a username' });
      } else {
        if (!req.body.password) {
          res.json({ success: false, message: 'You must provide a password' });
        } else {
          var user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          user.save(function(err)  {
            if (err) {
              if (err.code === 11000) {
                res.json({ success: false, message: 'Username or e-mail already exists' });
              } else {
                if (err.errors) {
                  if (err.errors.email) {
                    res.json({ success: false, message: err.errors.email.message });
                  } else {
                    if (err.errors.username) {
                      res.json({ success: false, message: err.errors.username.message });
                    } else {
                      if (err.errors.password) {
                        res.json({ success: false, message: err.errors.password.message });
                      } else {
                        res.json({ success: false, message: err });
                      }
                    }
                  }
                } else {
                  res.json({ success: false, message: 'Could not save user. Error:' + err });
                }
              }
            } else {
              res.json({ success: true, message: 'Acount registered!' });
            }
          });
        }
      }
    }
  });


  //Checking exiting email
  router.get('/checkEmail/:email', function(req, res) {
    if (!req.params.email) {
      res.json({ success: false, message: 'E-mail was not provided' });
    } else {
      User.findOne({email: req.params.email}, function(err, user){
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'E-mail is already taken' });
          } else {
            res.json({ success: true, message: 'E-mail is available' });
          }
        }
      });
    }
  });



  //Checking exiting username
  router.get('/checkUsername/:username', function(req, res) {
    if (!req.params.username) {
      res.json({ success: false, message: 'Username was not provided' });
    } else {
      User.findOne({ username: req.params.username }, function(err, user)  {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          if (user) {
            res.json({ success: false, message: 'Username is already taken' });
          } else {
            res.json({ success: true, message: 'Username is available' });
          }
        }
      });
    }
  });


  //Login
  router.post('/login', function(req, res)  {
      if (!req.body.email) {
      res.json({ success: false, message: 'No email was provided' });
    } else {
      if (!req.body.password) {
        res.json({ success: false, message: 'No password was provided.' });
      } else {
        User.findOne({ email: req.body.email.toLowerCase()}, function(err, user) {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            if (!user) {
              res.json({ success: false, message: 'Email not found.' });
            } else {
              const validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({ success: false, message: 'Password invalid' });
              } else {
                const token = jwt.sign({ data:user}, 'kamlesh', { expiresIn: '1d' });
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username
                  }
                });
              }
            }
          }
        });
      }
    }
  });

  //Middleware for authorization
  router.use(function(req, res, next)  {
    const token = req.headers['authorization'] || req.query.token;

      if (!token) {
      res.json({ success: false, message: 'No token provided' });
      } else {
        jwt.verify(token, 'kamlesh', function(err, decoded) {
        if (err) {
          res.json({ success: false, message: 'Token invalid: ' + err });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  //To set profile
  router.get('/profile', function(req, res)  {
    User.findOne({_id: req.decoded.data.userId }).select('username email').exec(function(err, user)  {
      if (err) {
        res.json({ success: false, message: err });
      } else {
          res.json({ success: true, user: user });
        }

    });
  });

  return router; // Return router object to main index.js
}
