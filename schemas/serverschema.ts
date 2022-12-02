import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    rainbow_speed: { type: Number, required: true, default: 1 },
    trap_active: { type: Boolean, required: true, default: false },
    giftbox_price: { type: Number, required: true },
    ban_andreea_ticket_price: { type: Number, required: true },
    trap_ticket_price: { type: Number, required: true },
    modify_server_ticket_price: { type: Number, required: true },
    nadir_ticket_price: { type: Number, required: true },
    escape_ticket_price: { type: Number, required: true },
    stfu_ticket_price: { type: Number, required: true },
    speak_ticket_price: { type: Number, required: true },
    bistari_per_message: { type: Number, required: true },
    giftpoints_per_payday: { type: Number, required: true },
    bistar_payday_multiplier: { type: Number, required: true },
    slots_roll_emoji: { type: String, required: true },
    slots_jackpot_emoji: { type: String, required: true },
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('server', schema, 'server')