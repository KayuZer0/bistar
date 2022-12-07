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
});
// schema.plugin(mongooseUniqueValidator)
exports.default = mongoose_1.default.model('jobs', schema, 'jobs');
