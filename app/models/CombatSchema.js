
const mongoose = require('mongoose')

const combatSchema = new mongoose.Schema({
    nome: String,
    monstros: Array,
    user: String
}, {
    collection: 'combat',
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

try {
    module.exports = exports = mongoose.model('combat')
} catch (error) {
    module.exports = exports = mongoose.model('combat', combatSchema)
} 