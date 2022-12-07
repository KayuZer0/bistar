import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    vanity_name: { type: String, required: true },
    vanity_emoji: { type: String, required: true },
    sell_price: { type: Number, required: true },
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('ores', schema, 'ores')