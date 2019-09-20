const User = require('../models/user'); // Import User Model Schema
const Guest = require('../models/guest'); // Import Guest Model Schema
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = function(router)  {

    //Add new guest
    router.post('/newGuest', function(req, res)  {
        if (!req.body.name) {
            res.json({ success: false, message: 'Name is required.' });
        } else {
              if (!req.body.email) {
                res.json({ success: false, message: 'Email is required.' });
              } else {
                      if (!req.body.phone) {
                        res.json({ success: false, message: 'Phone number is required.' });
                      } else {
                              if (!req.decoded.data.username) {
                                res.json({ success: false, message: 'Guest creator is required.' });
                              }
                              else {
                                        const guest = new Guest({
                                        name: req.body.name,
                                        email: req.body.email,
                                        phone: req.body.phone,
                                        createdBy: req.decoded.data.username
                                    });
                                    guest.save(function(err) {
                                        if (err) {
                                            if (err.errors) {
                                                if (err.errors.name) {
                                                    res.json({success: false, message: err.errors.name.message});
                                                } else {
                                                    if (err.errors.email) {
                                                        res.json({success: false, message: err.errors.email.message});
                                                    } else {
                                                        if (err.errors.phone) {
                                                            res.json({
                                                                success: false,
                                                                message: err.errors.phone.message
                                                            });
                                                        } else {
                                                            res.json({success: false, message: err});
                                                        }
                                                    }
                                                }
                                            }
                                            else
                                                {
                                                    res.json({success: false, message: err});
                                                }
                                            }else {
                                                 res.json({ success: true, message: 'Guest saved!' });
                                }});
                            };
                }
            }
        }
});

    //To view all guest
    router.get('/allGuests', function(req, res) {
        if(req.decoded.data.isAdmin === true){
            Guest.find({},function (err, guests) {
                if (err) {
                    res.json({success: false, message: err});
                } else {
                    res.json({success: true, guests: guests});

                }
            }).sort({ '_id': -1 });
        }
        else
        {
            Guest.find({createdBy:req.decoded.data.username}, function (err,guests) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    res.json({ success: true, guests: guests });
                }
            }).sort({ '_id': -1 });
        }
    });


 //To view single guest
  router.get('/singleGuest/:id', function(req, res) {
    if (!req.params.id) {
      res.json({ success: false, message: 'No guest ID was provided.' });
    } else {
      Guest.findOne({ _id: req.params.id }, function(err, guest) {
        if (err) {
          res.json({ success: false, message: 'Not a valid guest id' });
        } else {
          if (!guest) {
            res.json({ success: false, message: 'Guest not found.' });
          } else {
            User.findOne({ _id: req.decoded.userId}, function(err, user){
              if (err) {
                res.json({ success: false, message: err });
              } else {

                    res.json({ success: true, guest: guest });


              }
            });
          }
        }
      });
    }
  });

 //Update guest
  router.put('/updateGuest', function(req, res){
    if (!req.body._id) {
      res.json({ success: false, message: 'No guest id provided' });
    } else {
      Guest.findOne({ _id: req.body._id }, function(err, guest) {
        if (err) {
          res.json({ success: false, message: 'Not a valid guest id' });
        } else {
                    guest.name = req.body.name;
                    guest.email = req.body.email;
                    guest.phone = req.body.phone;
                    guest.save(function(err) {
                        if (err) {
                        if (err.errors) {
                          res.json({ success: false, message: 'Please ensure form is filled out properly' });
                        } else {
                          res.json({ success: false, message: err });
                        }
                      } else {
                        res.json({ success: true, message: 'Guest Updated!' });

                      };
                    })
              }
        });
    }
  });


  //Delete guest
  router.delete('/deleteGuest/:id', function(req, res) {
    if (!req.params.id) {
      res.json({ success: false, message: 'No id provided' });
    } else {
      Guest.findOne({_id: req.params.id }, function(err, guest) {
          if (err) {
              res.json({success: false, message: 'Invalid id'});
          } else {
                  guest.remove(function (err) {
                  if (err) {
                      res.json({success: false, message: err});
                  } else {
                      res.json({success: true, message: 'Guest deleted!'});
                  }
              });
          }
    })
  }});


  //Update guest
  router.put('/updateOutTime/:id',function (req, res) {
      if (!req.params.id) {
          res.json({ success: false, message: 'No guest id provided' });
      } else {

          Guest.update({_id: req.params.id}, {$set: {out_time: Date.now()}}, function (err, guest) {
              if (err) {
                  res.json({success: false, message: 'Invalid id'});
              }else
              {
                  res.json({ success: true, message: guest});
              }

          });
      }
  })


    return router;
};
