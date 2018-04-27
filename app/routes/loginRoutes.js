module.exports = function (app, passport, mongoose, configDB) {

    app.get('/', function (req, res) {
        res.render("index.ejs", { message: req.flash('loginMessage') });
    })

    app.get('/signup', function (req, res) {
        res.render('auth/signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/combates/create', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.get('/login', function (req, res) {
        res.render('auth/login.ejs', { message: req.flash('loginMessage') });
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/combates/list', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

}