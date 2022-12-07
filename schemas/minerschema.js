"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    skill: { type: Number, required: true },
    max_ores: { type: Number, required: true },
    coal_chance: { type: Number, required: true },
    copper_chance: { type: Number, required: true },
    iron_chance: { type: Number, required: true },
    gold_chance: { type: Number, required: true },
    diamond_chance: { type: Number, required: true },
    emerald_chance: { type: Number, required: true },
    pp_chance: { type: Number, required: true },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('miner', schema, 'miner');
