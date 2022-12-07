import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    vanity_name: { type: String, required: true },
    shop_price: { type: Number, required: true },
    info: { type: String, required: true },
    usage: { type: String, required: true }
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('tickets', schema, 'tickets')