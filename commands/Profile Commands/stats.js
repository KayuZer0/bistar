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
const discord_js_1 = require("discord.js");
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const jobschema_1 = __importDefault(require("../../schemas/jobschema"));
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "Profile",
    description: "Vezi statisticile tale sau ale altui user.",
    slash: true,
    options: [{
            name: "user",
            description: "Cui vrei sa vezi statisticile.",
            type: "USER",
            required: false
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const userArg = interaction.options.getUser('user');
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        let member;
        let dbDoc;
        if (userArg == null) {
            member = interaction.user.username;
            dbDoc = cmdAuthorDbDoc;
        }
        else {
            const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg === null || userArg === void 0 ? void 0 : userArg.id });
            if (!mentionedUserDbDoc) {
                interaction.reply({
                    content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                    ephemeral: true,
                });
                return;
            }
            member = userArg.username;
            dbDoc = mentionedUserDbDoc;
        }
        let bistari = dbDoc.bistari;
        let premiumPoints = dbDoc.premium_points;
        let level = dbDoc.level;
        let rp = dbDoc.respect_points;
        let rpToNextLevel = dbDoc.respect_points_to_next_level;
        let job = dbDoc.job;
        let skillMessage;
        const jobsDbDoc = yield jobschema_1.default.findOne({ 'job_id': job });
        if (jobsDbDoc == null) {
            interaction.reply({
                content: `**Frate s-a produs o eroare pentru ca jobul tau e invalid. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        if (job == 0) {
            skillMessage = ``;
        }
        else {
            const jobName = jobsDbDoc.name;
            const jobSkillName = jobsDbDoc.skill_name; //miner_skill
            const skill = cmdAuthorDbDoc.get(jobSkillName);
            const jobWorkedQuery = jobName + '_worked';
            const jobWorked = cmdAuthorDbDoc.get(jobWorkedQuery);
            let workedForNextSkill = `/Max`;
            if (skill < 6) {
                const workedForNextSkillQuery = 'worked_for_skill_' + (cmdAuthorDbDoc.get(jobSkillName) + 1).toString();
                workedForNextSkill = `/${jobsDbDoc.get(workedForNextSkillQuery)}`;
            }
            skillMessage = `💪 **Skill:** ${skill} (${jobWorked}${workedForNextSkill})`;
        }
        let jobVanityName = jobsDbDoc.vanity_name;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`${member} - Stats`)
            .setDescription(`${serverDbDoc.bistar_emoji} **BI$TARI:** ${bistari}\n${serverDbDoc.pp_emoji} **Premium Points:** ${premiumPoints}\n\n⚙️ **Level:** ${level}\n⭐ **Respect Points:** ${rp}/${rpToNextLevel}\n\n💼 **Job:** ${jobVanityName}\n${skillMessage}`);
        interaction.reply({
            embeds: [embed]
        });
    })
};
