
const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema({
    personagem: String,
    hp: Number,
    ca: Number,
    des: Number,
    jogador: String,
    background: String,
    user: String
}, {
    collection: 'player',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

try {
    module.exports = exports = mongoose.model('player')
} catch (error) {
    module.exports = exports = mongoose.model('player', playerSchema)
} 