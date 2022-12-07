"use strict";
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
exports.default = {
    category: "Economy",
    description: "Vezi ce poti sa cumperi",
    slash: true,
    options: [
        {
            name: "user",
            description: "Cui vrei sa dai BI$TARI.",
            type: "USER",
            required: true
        },
        {
            name: "amount",
            description: "Cati BI$TARI vrei sa dai.",
            type: "INTEGER",
            required: true
        }
    ],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const userArg = interaction.options.getUser('user');
        const amountArg = interaction.options.getInteger('amount');
        if (amountArg == null || userArg == null) {
            return;
        }
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
        if (cmdAuthorDbDoc == null || mentionedUserDbDoc == null) {
            return;
        }
        var bistari = cmdAuthorDbDoc.bistari;
        var mentionedUserBistari = mentionedUserDbDoc.bistari;
        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        if (amountArg < 0) {
            interaction.reply({
                content: `**Ai retardation cum trimiti BI$TARI pe minus?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        if (bistari < amountArg) {
            interaction.reply({
                content: `**Sarakule nu ai destui BI$TARI. Ai doar** ${bistari}`,
                files: ['./resources/muie.jpg'],
                ephemeral: true,
            });
            return;
        }
        const newAuthorBistari = bistari - amountArg;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { bistari: newAuthorBistari });
        const newMentionedUserBistari = mentionedUserBistari + amountArg;
        yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { bistari: newMentionedUserBistari });
        const memberArg = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userArg === null || userArg === void 0 ? void 0 : userArg.id.toString());
        interaction.reply({
            content: `**Ai trimis cu succes** ${amountArg} **BI$TARI lui ${memberArg}**`,
            files: ['./resources/bistari.gif'],
        });
    })
};
