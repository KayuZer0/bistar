"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    user_id: { type: String, required: true, unique: true },
    bistari: { type: Number, required: true, default: 0 },
    premium_points: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 1 },
    respect_points: { type: Number, required: true, default: 0 },
    respect_points_to_next_level: { type: Number, required: true, default: 10 },
    job: { type: Number, required: true, default: 0 },
    miner_skill: { type: Number, required: true, default: 1 },
    miner_worked: { type: Number, required: true, default: 0 },
    coal: { type: Number, required: true, default: 0 },
    copper: { type: Number, required: true, default: 0 },
    iron: { type: Number, required: true, default: 0 },
    gold: { type: Number, required: true, default: 0 },
    diamond: { type: Number, required: true, default: 0 },
    emerald: { type: Number, required: true, default: 0 },
    ban_andreea_tickets: { type: Number, required: true, default: 0 },
    modify_server_tickets: { type: Number, required: true, default: 0 },
    taci_tickets: { type: Number, required: true, default: 0 },
    nu_tac_tickets: { type: Number, required: true, default: 0 },
    basic_crates: { type: Number, required: true, default: 0 },
    taci: { type: Boolean, required: true, default: false },
    messages_sent: { type: Number, required: true, default: 0 },
    roles_cache: { type: Array, required: true },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('users', schema, 'users');
