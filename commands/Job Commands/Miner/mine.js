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
const utils = __importStar(require("../../../utils"));
const serverschema_1 = __importDefault(require("../../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../../schemas/userschema"));
const minerschema_1 = __importDefault(require("../../../schemas/minerschema"));
const oreschema_1 = __importDefault(require("../../../schemas/oreschema"));
exports.default = {
    category: "Miner Job",
    description: "Mineaza niste minereuri calificate.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        if (cmdAuthorDbDoc.job != 1) {
            interaction.reply({
                content: `**Unde te duci bai haladitule daca nu esti Miner? Foloseste /jobs**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
        }
        const minerDbDoc = yield minerschema_1.default.findOne({ 'skill': cmdAuthorDbDoc.miner_skill });
        if (minerDbDoc == null) {
            return;
        }
        let max_ores = minerDbDoc.max_ores;
        let chances = [minerDbDoc.coal_chance, minerDbDoc.copper_chance, minerDbDoc.iron_chance, minerDbDoc.gold_chance, minerDbDoc.diamond_chance, minerDbDoc.emerald_chance, minerDbDoc.pp_chance];
        let ores = [];
        const m1 = new discord_js_1.MessageEmbed()
            .setTitle(`Ai inceput sa minezi. Asteapta sa vezi ce ai gasit.`)
            .setImage(serverDbDoc.mine_gif_url);
        yield interaction.reply({
            embeds: [m1]
        });
        for (var i = 0; i < max_ores; i++) {
            let ore = utils.percentageChance(['coal', 'copper', 'iron', 'gold', 'diamond', 'emerald', 'premium_points'], chances);
            const oresDbDoc = yield oreschema_1.default.findOne({ 'name': ore });
            yield userschema_1.default.findOneAndUpdate({ user_id: interaction.user.id }, { $inc: { [ore]: 1 } });
            ores.push(`${oresDbDoc === null || oresDbDoc === void 0 ? void 0 : oresDbDoc.vanity_emoji} ${oresDbDoc === null || oresDbDoc === void 0 ? void 0 : oresDbDoc.vanity_name} x1`);
        }
        const rp = utils.GetRandomNumber(1, 4) + cmdAuthorDbDoc.miner_skill;
        yield userschema_1.default.findOneAndUpdate({ user_id: interaction.user.id }, { $inc: { respect_points: rp } });
        ores.push(`:star: **Respect Points** x${rp}`);
        let finalOres = [];
        for (var i = 0; i < ores.length; i++) {
            finalOres.push(`**+** ${ores[i]}\n`);
        }
        const m2 = new discord_js_1.MessageEmbed()
            .setTitle(`Ai terminat de minat!`)
            .setDescription(finalOres.toString().replaceAll(`,`, ``));
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                embeds: [m2]
            });
        }), 4200);
    })
};