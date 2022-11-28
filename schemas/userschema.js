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
    ban_andreea_tickets: { type: Number, required: true, default: 0 },
    nadir_tickets: { type: Number, required: true, default: 0 },
    escape_nadir_tickets: { type: Number, required: true, default: 0 },
    taci_tickets: { type: Number, required: true, default: 0 },
    nu_tac_tickets: { type: Number, required: true, default: 0 },
    taci: { type: Boolean, required: true, default: false },
    trap_tickets: { type: Number, required: true, default: 0 },
    modify_server_tickets: { type: Number, required: true, default: 0 },
    gift_points: { type: Number, required: true, default: 0 },
    messages_sent: { type: Number, required: true, default: 0 },
    xd_counter: { type: Number, required: true, default: 0 },
    roles_cache: { type: Array, required: true },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('users', schema, 'users');
