"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
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
    premium_points_per_payday: { type: Number, required: true },
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
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('server', schema, 'server');
