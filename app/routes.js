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

    app.get('/login', function(req, res){
        res.render('auth/login.ejs', { message: req.flash('loginMessage') }); 
    })

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/combates/list', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }
    
    app.get('/combates/create', isLoggedIn, function (req, res) {
        var monsters = require("../public/json/monsters.json");

        res.render("combates/create.ejs", { monsters: monsters})
    })

    app.get('/combates/list', isLoggedIn, function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))
            var combatSchema = require('../app/models/CombatSchema');
            combatSchema.find({ 'user': req.user._id }, function (err, resp) {
                console.log(resp);
                res.render("combates/list.ejs", { data: resp });
            });
        })
    })

    app.get("/combates/edit/:id", function (req, res) {
        var _id = req.params.id;
        var monsters = require("../public/json/monsters.json");

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var combatSchema = require('../app/models/CombatSchema');

            combatSchema.find({ '_id': _id }, function (err, resp) {
                console.log(resp);
                res.render("combates/edit.ejs", { data: resp, monsters: monsters });
            });
        })
    })

    app.post("/editar/combate", function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var CombatSchema = require('../app/models/CombatSchema');

            let result = new CombatSchema(req.body);
            console.log(req.body);
            result.update(req.body, function (err, affected, resp) {
                if (err) {
                    req.flash('error', 'Não foi possível editar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro editado com sucesso!');
                    res.redirect('../list');
                }
            })
        })
    })

    app.post("/combates/cadastro", isLoggedIn, function (req, res) {
        req.body.user = req.user._id;
        console.log(req.body);
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var CombatSchema = require('../app/models/CombatSchema');

            let result = new CombatSchema(req.body);

            console.log(req.body);
            result.save((err) => {
                if (err) {
                    req.flash('error', 'Não foi possível realizar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro realizado com sucesso!');
                    res.redirect('../list');
                }
            });
        })
    })

    app.get("/combates/run/:id", isLoggedIn, function(req, res) {
        var _id = req.params.id;
        var user = req.user._id;
        var monsters = require("../public/json/monsters.json");

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var combatSchema = require('../app/models/CombatSchema');

            combatSchema.find({ '_id': _id }, function (err, resp) {
                if(!err){
                    var playerSchema = require('../app/models/PlayerSchema');

                    playerSchema.find({ 'user': user }, function (errPlayer, respPlayer) {
                        if(!errPlayer){
                            var npcSchema = require('../app/models/NpcSchema');

                            npcSchema.find({'user': user}, function (errNpc, respNpc) {
                                res.render("combates/run.ejs", {monsters: resp, players: respPlayer, npcs: respNpc, data: monsters});
                            });
                        }
                    });
                }
            });
        })
    })

    app.get("/combates/remove/:id", isLoggedIn, function (req, res) {
        var _id = req.params.id;

        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var CombatSchema = require('../app/models/CombatSchema');

            // let result = new playerSchema(req.body);
            console.log(req.body);
            CombatSchema.remove({ '_id': _id }, function (err, affected, resp) {
                if (err) {
                    req.flash('error', 'Não foi possível deletar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro deletado com sucesso!');
                    res.redirect('../list');
                }
            })
        })
    })

    // ROTAS RELACIONADAS AO GERENCIAMENTO DE PLAYERS
    //
    //

    app.get('/players/list', isLoggedIn, function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))
            var playerSchema = require('../app/models/PlayerSchema');
            playerSchema.find({ 'user': req.user._id }, function (err, resp) {
                console.log(resp);
                res.render("players/list.ejs", { data: resp });
            });
        })
    })

    app.get('/players/create', function (req, res) {
        res.render("players/create.ejs");
    })

    app.post("/players/cadastro", isLoggedIn, function (req, res) {
        req.body.user = req.user._id;
        console.log(req.body);
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var PlayerSchema = require('../app/models/PlayerSchema');

            let result = new PlayerSchema(req.body);

            console.log(req.body);
            result.save((err) => {
                if (err) {
                    req.flash('error', 'Não foi possível completar o cadastro');
                    res.redirect('../create');
                }else{
                    req.flash('success', 'Cadastro realizado com sucesso!');
                    res.redirect('../list');
                }
            });
        })
    })

    app.get("/players/edit/:id", function (req, res) {
        var _id = req.params.id;

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var playerSchema = require('../app/models/PlayerSchema');

            playerSchema.find({ '_id': _id }, function (err, resp) {
                console.log(resp);
                res.render("players/edit.ejs", { data: resp });
            });
        })
    })

    app.post("/players/editar", function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var playerSchema = require('../app/models/PlayerSchema');

            let result = new playerSchema(req.body);
            console.log(req.body);
            result.update(req.body, function (err, affected, resp) {
                if (err) {
                    req.flash('error', 'Não foi possível editar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro editado com sucesso!');
                    res.redirect('../list');
                }
            })
        })
    })

    app.get("/players/remove/:id", isLoggedIn, function (req, res) {
        var _id = req.params.id;

        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var playerSchema = require('../app/models/PlayerSchema');

            // let result = new playerSchema(req.body);
            console.log(req.body);
            playerSchema.remove({ '_id': _id }, function (err, affected, resp) {
                console.log("err:"+err);
                console.log("affected:"+affected);
                console.log("resp:"+resp);
                if (err) {
                    req.flash('error', 'Não foi possível deletar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro deletado com sucesso!');
                    res.redirect('../list');
                }
            })
        })
    })

    //
    //
    // FIM DAS ROUTES DE PLAYERS

    // ROTAS RELACIONADAS AO GERENCIAMENTO DE PLAYERS
    //
    //

    app.get('/npcs/list', isLoggedIn, function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var npcSchema = require('../app/models/NpcSchema');
            npcSchema.find({'user': req.user._id}, function (err, resp) {
                console.log(resp);
                res.render("npcs/list.ejs", {data: resp});
            });
        })
    })

    app.get('/npcs/create', function (req, res) {
        res.render("npcs/create.ejs");
    })

    app.post("/npcs/cadastro", isLoggedIn, function (req, res) {
        req.body.user = req.user._id;
        console.log(req.body);
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var npcSchema = require('../app/models/NpcSchema');

            let result = new npcSchema(req.body);

            console.log(req.body);
            result.save((err) => {
                if (err) {
                    req.flash('error', 'Não foi possível completar o cadastro...');
                    res.redirect('../create');
                } else {
                    req.flash('success', 'Cadastro realizado com sucesso!');
                    res.redirect('../list');
                }
            });
        })
    })

    app.get("/npcs/edit/:id", function (req, res) {
        var _id = req.params.id;

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var npcSchema = require('../app/models/NpcSchema');

            npcSchema.find({'_id': _id}, function (err, resp) {
                console.log(resp);
                res.render("npcs/edit.ejs", {data: resp});
            });
        })
    })

    app.post("/npcs/editar", function (req, res) {
        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var npcSchema = require('../app/models/NpcSchema');

            let result = new npcSchema(req.body);
            console.log(req.body);
            result.update(req.body, function (err, affected, resp) {
                if (err) {
                    req.flash('error', 'Não foi possível editar o cadastro...');
                    res.redirect('list');
                } else {
                    req.flash('success', 'Cadastro editado com sucesso!');
                    res.redirect('list');
                }
            })
        })
    })

    app.get("/npcs/remove/:id", isLoggedIn, function (req, res) {
        var _id = req.params.id;

        // instacia o mongoose e faz a conexão
        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

             var npcSchema = require('../app/models/NpcSchema');

            console.log(req.body);
            npcSchema.remove({'_id': _id}, function (err, affected, resp) {
                console.log("err:" + err);
                console.log("affected:" + affected);
                console.log("resp:" + resp);
                if (err) {
                    req.flash('error', 'Não foi possível deletar o cadastro...');
                    res.redirect('../list');
                } else {
                    req.flash('success', 'Cadastro deletado com sucesso!');
                    res.redirect('../list');
                }
            })
        })
    })

    //
    //
    // FIM DAS ROUTES DE PLAYERS
}