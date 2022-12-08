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
    category: "Jobs",
    description: "Vezi la ce joburi poti sa lucrezi.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const bistari = cmdAuthorDbDoc.bistari;
        const jobName = (_a = (yield jobschema_1.default.findOne({ 'job_id': cmdAuthorDbDoc.job }))) === null || _a === void 0 ? void 0 : _a.vanity_name;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`Lista de joburi [-] /getjob <ID> [-] Momentan esti ${jobName}`)
            .addField(`${(_b = (yield jobschema_1.default.findOne({ 'job_id': 1 }))) === null || _b === void 0 ? void 0 : _b.vanity_emoji} **${(_c = (yield jobschema_1.default.findOne({ 'job_id': 1 }))) === null || _c === void 0 ? void 0 : _c.vanity_name} (ID: 1)**`, `\nㅤ ↳ **Info:** ${(_d = (yield jobschema_1.default.findOne({ 'job_id': 1 }))) === null || _d === void 0 ? void 0 : _d.info} \nㅤ ↳ **Comenzi:** ${(_e = (yield jobschema_1.default.findOne({ 'job_id': 1 }))) === null || _e === void 0 ? void 0 : _e.commands} \nㅤ ↳ **Tip:** ${(_f = (yield jobschema_1.default.findOne({ 'job_id': 1 }))) === null || _f === void 0 ? void 0 : _f.type}`, false)
            // .addField(`${(await jobschema.findOne({ 'job_id': 2 }))?.vanity_emoji} **${(await jobschema.findOne({ 'job_id': 2 }))?.vanity_name} (ID: 2)**`, `\nㅤ ↳ **Info:** ${(await jobschema.findOne({ 'job_id': 2 }))?.info} \nㅤ ↳ **Comenzi:** ${(await jobschema.findOne({ 'job_id': 2 }))?.commands} \nㅤ ↳ **Tip:** ${(await jobschema.findOne({ 'job_id': 2 }))?.type}`, false)
            .setFooter(`O sa mai vina joburi da simcer acuma nu mai am chef sa fac.`);
        interaction.reply({
            embeds: [embed]
        });
    })
};
