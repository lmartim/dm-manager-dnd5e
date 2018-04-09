
const mongoose = require('mongoose')

const npcSchema = new mongoose.Schema({
    nome: String,
    hp: Number,
    ca: Number,
    des: Number,
    informacoes: String,
    background: String,
    user: String
}, {
    collection: 'npc',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

try {
    module.exports = exports = mongoose.model('npc')
} catch (error) {
    module.exports = exports = mongoose.model('npc', npcSchema)
} 