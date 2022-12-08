"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../../utils"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const jobschema_1 = __importDefault(require("../../schemas/jobschema"));
exports.default = {
    category: "Help",
    description: "Vezi comensile boss",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const job = cmdAuthorDbDoc.job;
        if (job == 0) {
            interaction.reply({
                content: `**La ce vrei sa cresti skillu daca nu ai job? Foloseste** /jobs`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const jobsDbDoc = yield jobschema_1.default.findOne({ 'job_id': job });
        if (jobsDbDoc == null) {
            interaction.reply({
                content: `**Frate s-a produs o eroare pentru ca jobul tau e invalid. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        const jobSkillName = jobsDbDoc.skill_name;
        const jobName = jobsDbDoc.name;
        const jobVanityName = jobsDbDoc.vanity_name;
        const jobWorkedQuery = jobName + '_worked';
        const jobWorked = cmdAuthorDbDoc.get(jobWorkedQuery);
        const workedForNextSkillQuery = 'worked_for_skill_' + (cmdAuthorDbDoc.get(jobSkillName) + 1).toString();
        const workedForNextSkill = jobsDbDoc.get(workedForNextSkillQuery);
        if (cmdAuthorDbDoc.get(jobSkillName) == 6) {
            interaction.reply({
                content: `**La ce vrei sa cresti skillu daca deja ai Skill 6?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        if (jobWorked < workedForNextSkill) {
            interaction.reply({
                content: `**Unde te grabesti asa serifule? Nu ai lucrat de suficiente ori ca sa upgradezi skillu. Ai lucrat:** ${jobWorked}/${workedForNextSkill}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const price = cmdAuthorDbDoc.get(jobSkillName) * jobsDbDoc.base_price_per_skill;
        if (cmdAuthorDbDoc.bistari < price) {
            interaction.reply({
                content: `**Unde te grabesti asa serifule? Nu ai destui BI$TARI ca sa upgradezi skillu. Ai doar:** ${cmdAuthorDbDoc.bistari}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const newBistari = cmdAuthorDbDoc.bistari - price;
        yield userschema_1.default.findOneAndUpdate({ user_id: interaction.user.id }, { $set: { bistari: newBistari } });
        const newSkill = cmdAuthorDbDoc.get(jobSkillName) + 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: interaction.user.id }, { $set: { [jobSkillName]: newSkill } });
        interaction.reply({
            content: `**Holy fucking shit ti-ai upgradad skillul la ${jobVanityName} si acum ai Skill** ${newSkill}`,
            files: ['./resources/mamacoaie.jpg'],
            ephemeral: true,
        });
        return;
    })
};
