import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    skill: { type: Number, required: true },
    max_ores: { type: Number, required: true },
    coal_chance: { type: Number, required: true },
    copper_chance: { type: Number, required: true },
    iron_chance: { type: Number, required: true },
    gold_chance: { type: Number, required: true },
    diamond_chance: { type: Number, required: true },
    emerald_chance: { type: Number, required: true },
    pp_chance: { type: Number, required: true },
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('miner', schema, 'miner')