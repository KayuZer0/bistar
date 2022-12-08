"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import mongooseUniqueValidator from "mongoose-unique-validator";
const schema = new mongoose_1.default.Schema({
    job_id: { type: Number, required: true },
    name: { type: String, required: true },
    skill_name: { type: String, required: true },
    vanity_name: { type: String, required: true },
    vanity_emoji: { type: String, required: true },
    info: { type: String, required: true },
    type: { type: String, required: true },
    commands: { type: String, required: true },
    worked_for_skill_2: { type: Number, required: true },
    worked_for_skill_3: { type: Number, required: true },
    worked_for_skill_4: { type: Number, required: true },
    worked_for_skill_5: { type: Number, required: true },
    worked_for_skill_6: { type: Number, required: true },
    base_price_per_skill: { type: Number, required: true },
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('jobs', schema, 'jobs');
