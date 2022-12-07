"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    vanity_name: { type: String, required: true },
    vanity_emoji: { type: String, required: true },
    sell_price: { type: Number, required: true },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('ores', schema, 'ores');
