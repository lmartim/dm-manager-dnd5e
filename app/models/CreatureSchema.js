const mongoose = require('mongoose')

const creatureSchema = new mongoose.Schema({
    name: String,
    size: String,
    alignment: String,
    armor_class: Number,
    hit_points: String,
    hit_dice: String,
    speed: String,
    strength: Number,
    dexterity: Number,
    constitution: Number,
    intelligence: Number,
    wisdom: Number,
    charisma: Number,
    strength_save: Number,
    dexterity_save: Number,
    constitution_save: Number,
    intelligence_save: Number,
    wisdom_save: Number,
    charisma_save: Number,
    acrobatics: Number,
    arcana: Number,
    athletics: Number,
    deception: Number,
    history: Number,
    insight: Number,
    intimidation: Number,
    investigation: Number,
    medicine: Number,
    nature: Number,
    perception: Number,
    performance: Number,
    persuasion: Number,
    religion: Number,
    stealth: Number,
    survival: Number,
    damage_vulnerabilities: String,
    damage_resistances: String,
    damage_immunities: String,
    senses: String,
    languages: String,
    challenge_rating: String,
    special_abilities: Array,
    actions: Array,
    legendary_actions: Array,
}, {
        collection: 'creature',
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    })

try {
    module.exports = exports = mongoose.model('creature')
} catch (error) {
    module.exports = exports = mongoose.model('creature', creatureSchema)
} 