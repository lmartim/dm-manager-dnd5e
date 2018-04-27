module.exports = function (app, passport, mongoose, configDB) {
    
    // ROTAS RELACIONADAS AO LOGIN
    require('./routes/loginRoutes.js')(app, passport, mongoose, configDB)

    // ROTAS RELACINADAS AO COMBATE
    require('./routes/combateRoutes.js')(app, passport, mongoose, configDB)

    // ROTAS RELACIONADAS AO GERENCIAMENTO DE PLAYERS
    require('./routes/playerRoutes.js')(app, passport, mongoose, configDB)

    // ROTAS RELACIONADAS AO GERENCIAMENTO DE NPCS
    require('./routes/npcRoutes.js')(app, passport, mongoose, configDB)

    // ROTAS RELACIONADAS AO GERENCIAMENTO DE CRIATURAS
    require('./routes/creatureRoutes.js')(app, passport, mongoose, configDB)

}