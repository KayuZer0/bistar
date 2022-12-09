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
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const utils = __importStar(require("../../utils"));
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
exports.default = {
    category: "Economy",
    description: "Incearca sa furi de la cnv da vezi poate ajungi la anchisoare (Nadir)!!!",
    slash: true,
    options: [{
            name: "user",
            description: "Pe cine vrei sa incerci sa jefuiesti.",
            type: "USER",
            required: true
        }],
    cooldown: "15m",
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const userArg = interaction.options.getUser('user');
        if (userArg == null || interaction.member == null) {
            return;
        }
        const memberArg = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(userArg === null || userArg === void 0 ? void 0 : userArg.id.toString());
        if (memberArg == null) {
            return;
        }
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        if (!cmdAuthorDbDoc || !serverDbDoc) {
            return;
        }
        let authorRoles = ((_b = interaction.member) === null || _b === void 0 ? void 0 : _b.roles).cache;
        let mentionedMemberRoles = (memberArg === null || memberArg === void 0 ? void 0 : memberArg.roles).cache;
        if (mentionedMemberRoles.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Baiete nu poti sa furi de la BI$TAR**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        if (cmdAuthorDbDoc.bistari < 200) {
            interaction.reply({
                content: `**Nu poti sa furi de la cineva daca ai mai putin de 200 ${serverDbDoc.bistar_emoji}**`,
                ephemeral: true
            });
            return;
        }
        if (mentionedUserDbDoc.bistari < 200) {
            interaction.reply({
                content: `**Nu poti sa furi de la cineva care are mai putin de 200 ${serverDbDoc.bistar_emoji}, nesimptitule.**`,
                ephemeral: true
            });
            return;
        }
        const authorMemberObject = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get((_d = interaction.user) === null || _d === void 0 ? void 0 : _d.id.toString());
        if (authorMemberObject == undefined) {
            return;
        }
        let authorBistari = cmdAuthorDbDoc.bistari;
        let mentionedUserBistari = mentionedUserDbDoc.bistari;
        let newAuthorBistari = authorBistari;
        let newMentionedUserBistari = mentionedUserBistari;
        var stealMessage = "";
        var rand = Math.random();
        if (rand <= 0.45) {
            // Fura jumate din bistari
            newAuthorBistari = Math.floor(authorBistari + (mentionedUserBistari / 2));
            newMentionedUserBistari = Math.floor(mentionedUserBistari / 2);
            stealMessage = `**Ai furat ** ${Math.floor(mentionedUserBistari / 2)} **${serverDbDoc.bistar_emoji} de la** ${memberArg}`;
        }
        else {
            // Primesti Nadir in pula mea
            newAuthorBistari = Math.floor(authorBistari - (authorBistari / 2));
            if ((authorRoles.some((role) => role.id === utils.BISTAR_ROLE_ID) || interaction.user.id == utils.KAYU_ID)) {
                utils.MakeNadir(memberArg);
                stealMessage = `**Ai fost prins de Aitilop in timp ce incercai sa furi de la ${memberArg}. Acum esti Nadir. Ai pierdut** ${Math.floor(authorBistari / 2)} ${serverDbDoc.bistar_emoji}`;
            }
            else {
                stealMessage = `**Ai fost prins de Aitilop in timp ce incercai sa furi de la ${memberArg}. Ai pierdut** ${Math.floor(authorBistari / 2)} ${serverDbDoc.bistar_emoji}`;
            }
        }
        yield userschema_1.default.findOneAndUpdate({ user_id: (_e = interaction.member) === null || _e === void 0 ? void 0 : _e.user.id }, { bistari: newAuthorBistari });
        yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { bistari: newMentionedUserBistari });
        interaction.reply({
            content: stealMessage
        });
    })
};
