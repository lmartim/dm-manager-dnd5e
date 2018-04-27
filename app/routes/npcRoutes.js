module.exports = function (app, passport, mongoose, configDB) {
    
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on 
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
    }

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

            var npcSchema = require('../models/NpcSchema');
            npcSchema.find({ 'user': req.user._id }, function (err, resp) {
                console.log(resp);
                res.render("npcs/list.ejs", { data: resp });
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

            var npcSchema = require('../models/NpcSchema');

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

            var npcSchema = require('../models/NpcSchema');

            npcSchema.find({ '_id': _id }, function (err, resp) {
                console.log(resp);
                res.render("npcs/edit.ejs", { data: resp });
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

            var npcSchema = require('../models/NpcSchema');

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

            var npcSchema = require('../models/NpcSchema');

            console.log(req.body);
            npcSchema.remove({ '_id': _id }, function (err, affected, resp) {
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

}