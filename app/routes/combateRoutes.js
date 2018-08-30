module.exports = function (app, passport, mongoose, configDB) {

    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

    app.get('/users', function(req, res){
        monsters = require("../../public/json/monsters.json")
        res.json([{
            monsters: JSON.stringify(monsters)
        }]);
        console.log(res);
    })

    app.get('/combates/create', isLoggedIn, function (req, res) {
        var monsters = require("../../public/json/monsters.json");

        res.render("combates/create.ejs", { monsters: monsters })
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
            var combatSchema = require('../models/CombatSchema');
            combatSchema.find({ 'user': req.user._id }, function (err, resp) {
                console.log(resp);
                res.render("combates/list.ejs", { data: resp });
            });
        })
    })

    app.get("/combates/edit/:id", function (req, res) {
        var _id = req.params.id;
        var monsters = require("../../public/json/monsters.json");

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var combatSchema = require('../models/CombatSchema');

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

            var CombatSchema = require('../models/CombatSchema');

            let result = new CombatSchema(req.body);
            console.log(req.body);
            result.update(req.body, function (err, affected, resp) {
                if (err) {
                    req.flash('error', 'Não foi possível editar o cadastro...');
                    res.redirect('../combates/list');
                } else {
                    req.flash('success', 'Cadastro editado com sucesso!');
                    res.redirect('../combates/list');
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

            var CombatSchema = require('../models/CombatSchema');

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

    app.get("/combates/run/:id", isLoggedIn, function (req, res) {
        var _id = req.params.id;
        var user = req.user._id;
        var monsters = require("../../public/json/monsters.json");

        let db = mongoose.connect(configDB.db.uri, {
            useMongoClient: true,
            autoIndex: false,
            poolSize: 30
        })

        //evento conexão
        db.on('error', console.error.bind(console, 'connection error:'))
        db.once('open', () => {
            console.log('mongoose conected in ' + configDB.db.uri.replace('mongodb://', ''))

            var combatSchema = require('../models/CombatSchema');

            combatSchema.find({ '_id': _id }, function (err, resp) {
                if (!err) {
                    var playerSchema = require('../models/PlayerSchema');

                    playerSchema.find({ 'user': user }, function (errPlayer, respPlayer) {
                        if (!errPlayer) {
                            var npcSchema = require('../models/NpcSchema');

                            npcSchema.find({ 'user': user }, function (errNpc, respNpc) {
                                res.render("combates/run.ejs", { monsters: resp, players: respPlayer, npcs: respNpc, data: monsters });
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

            var CombatSchema = require('../models/CombatSchema');

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

}