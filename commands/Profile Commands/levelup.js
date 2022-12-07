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
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
exports.default = {
    category: "Profile",
    description: "Da level up daca poti.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const bistari = cmdAuthorDbDoc.bistari;
        const premiumPoints = cmdAuthorDbDoc.premium_points;
        const level = cmdAuthorDbDoc.level;
        const rp = cmdAuthorDbDoc.respect_points;
        const rpToNextLevel = cmdAuthorDbDoc.respect_points_to_next_level;
        if (rp < rpToNextLevel) {
            interaction.reply({
                content: `**Unde coxu meu dai tu level up daca nu ai destule Respect Points? Momentan ai:** ${rp}/${rpToNextLevel}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        const newLevel = level + 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { level: newLevel });
        const newRP = rp - rpToNextLevel;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { respect_points: newRP });
        const newRpToNextLevel = rpToNextLevel + serverDbDoc.respect_points_increment;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id }, { respect_points_to_next_level: newRpToNextLevel });
        let bonusMsg = ``;
        if (newLevel % 5 == 0) {
            let bistariBonus = utils.GetRandomNumber(10, 151);
            let ppBonus = utils.GetRandomNumber(1, 16);
            const newBistari = bistari + bistariBonus;
            yield userschema_1.default.findOneAndUpdate({ user_id: (_d = interaction.member) === null || _d === void 0 ? void 0 : _d.user.id }, { bistari: newBistari });
            const newPremiumPoints = premiumPoints + ppBonus;
            yield userschema_1.default.findOneAndUpdate({ user_id: (_e = interaction.member) === null || _e === void 0 ? void 0 : _e.user.id }, { bistari: newBistari });
            bonusMsg = `\n**Ai primit un bonus pentru ca ai atins level ${newLevel}!**\n**Ai primit** ${bistariBonus} **BI$TARI.**\n**Ai primit** ${ppBonus} **Premium Points.**`;
        }
        interaction.reply({
            content: `**Holy fucking shit tocmai ai dat level up!**\n**Acum ai Level:** ${newLevel}\n**Respect Points:** ${newRP} ${bonusMsg}`,
        });
    })
};
