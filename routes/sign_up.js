var router = require('express').Router();
var studentid = require('studentid');

router.get('/', function(req, res) {
    res.render('signup', {message: req.flash('signupMessage')});
});

// process the signup form
router.post('/', studentid.authenticate('local-signup', {
    successRedirect : '/dashboard', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;