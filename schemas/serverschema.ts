import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    rainbow_speed: { type: Number, required: true, default: 1 },
    trap_active: { type: Boolean, required: true, default: false },
    bistari_per_message: { type: Number, required: true },
    base_payday: { type: Number, required: true },
    premium_points_per_payday: { type: Number, required: true },
    rp_added_per_payday: { type: Number, required: true },
    respect_points_increment: { type: Number, required: true },
    bistar_payday_multiplier: { type: Number, required: true },
    slots_roll_emoji: { type: String, required: true },
    slots_jackpot_emoji: { type: String, required: true },
    coal_emoji: { type: String, required: true },
    copper_emoji: { type: String, required: true },
    iron_emoji: { type: String, required: true },
    gold_emoji: { type: String, required: true },
    diamond_emoji: { type: String, required: true },
    emerald_emoji: { type: String, required: true },
    mine_gif_url: { type: String, required: true }
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('server', schema, 'server')