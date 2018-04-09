module.exports = {
    name: 'combat-manager-node',
    version: '0.0.1',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 9000,
    db: {
        uri: 'mongodb://dungmaster:tarrasq@ds237815.mlab.com:37815/combat-manager',
        port: '37815' 
    }
}