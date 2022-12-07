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
        const giftBoxPrice = serverDbDoc.giftbox_price;
        let member;
        let bistari;
        let premiumPoints;
        let level;
        let rp;
        let job;
        let skill;
        if (userArg == null) {
            member = interaction.user.username;
            bistari = cmdAuthorDbDoc.bistari;
            premiumPoints = cmdAuthorDbDoc.premium_points;
            level = cmdAuthorDbDoc.level;
            rp = cmdAuthorDbDoc.respect_points;
            job = cmdAuthorDbDoc.job;
            skill = cmdAuthorDbDoc.job_skill;
        }
        else {
            const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
            if (mentionedUserDbDoc == null) {
                return;
            }
            member = userArg.username;
            bistari = mentionedUserDbDoc.bistari;
            premiumPoints = mentionedUserDbDoc.premium_points;
            level = mentionedUserDbDoc.level;
            rp = mentionedUserDbDoc.respect_points;
            job = mentionedUserDbDoc.job;
            skill = mentionedUserDbDoc.job_skill;
        }
        const jobsDbDoc = yield jobschema_1.default.findOne({ 'job_id': job });
        const jobName = jobsDbDoc === null || jobsDbDoc === void 0 ? void 0 : jobsDbDoc.job_name;
        if (job == 0) {
            skill = ``;
        }
        else {
            skill = `\n💪 **Skill:** ${skill}`;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`${member} - Stats`)
            .setDescription(`💵 **BI$TARI:** ${bistari}\n:coin: **Premium Points:** ${premiumPoints}\n\n⚙️ **Level:** ${level}\n⭐ **Respect Points:** ${rp}\n\n💼 **Job:** ${jobName}${skill}`);
        interaction.reply({
            embeds: [embed]
        });
    })
};
