import { Channel, Role } from "discord.js";
import mongoose from "mongoose";
// import mongooseUniqueValidator from "mongoose-unique-validator";

const schema = new mongoose.Schema({
    job_id: { type: Number, required: true },
    name: { type: String, required: true },
    skill_name: { type: String, required: true },
    vanity_name: { type: String, required: true },
})

// schema.plugin(mongooseUniqueValidator)
export default mongoose.model('jobs', schema, 'jobs')