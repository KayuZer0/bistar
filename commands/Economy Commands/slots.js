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
const utils = __importStar(require("../../utils"));
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const index_1 = require("../../index");
exports.default = {
    category: "Economy",
    description: "Juaca la niste păcănele corecte (/slotsinfo)",
    slash: true,
    cooldown: '10s',
    options: [{
            name: "bet",
            description: "Cat vrei sa pariezi la pacanele.",
            type: "INTEGER",
            required: true
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const bet = interaction.options.getInteger('bet');
        var bistari = cmdAuthorDbDoc.bistari;
        if (bet == null)
            return;
        if (bet < 1) {
            yield interaction.reply({
                content: `**Coaie lasa legalele, cum vrei sa pariezi mai putin de 1 BI$TARI?.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        if (cmdAuthorDbDoc.bistari < bet) {
            interaction.reply({
                content: `**Sarakule nu ai destui BI$TARI. La munca nu la aparate.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true,
            });
            return;
        }
        //? 🍀 - ban lu andreea
        //? 🍉 - x2
        //? 🍒 - x3
        //? 🍇 - x5
        //? :bIan: - x 10
        const symbols = ["🍉", "🍒", "🍇", "🍀", serverDbDoc.slots_jackpot_emoji];
        // const symbols = ["🍀", "🍀", "🍀", "🍀", "🍀"]
        const spins = 2;
        const slotemoji = serverDbDoc.slots_roll_emoji;
        let $ = symbols[utils.GetRandomNumber(0, 5)];
        let $$ = symbols[utils.GetRandomNumber(0, 5)];
        let $$$ = symbols[utils.GetRandomNumber(0, 5)];
        const play = new discord_js_1.MessageEmbed()
            .setTitle(`Păcănele - Bet: ${bet}`)
            .setDescription("🢂 | " + slotemoji + " | " + slotemoji + " | " + slotemoji + " | 🢀")
            .setColor('RANDOM');
        const $1 = new discord_js_1.MessageEmbed()
            .setTitle(`Păcănele - Bet: ${bet}`)
            .setDescription("🢂 | " + $ + " | " + slotemoji + " | " + slotemoji + " | 🢀")
            .setColor('RANDOM');
        const $2 = new discord_js_1.MessageEmbed()
            .setTitle(`Păcănele - Bet: ${bet}`)
            .setDescription("🢂 | " + $ + " | " + $$ + " | " + slotemoji + " | 🢀")
            .setColor('RANDOM');
        const $3 = new discord_js_1.MessageEmbed()
            .setTitle(`Păcănele - Bet: ${bet}`)
            .setDescription("🢂 | " + $ + " | " + $$ + " | " + $$$ + " | 🢀")
            .setColor('RANDOM');
        yield interaction.reply({
            embeds: [play]
        });
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                embeds: [$1]
            });
        }), 600);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                embeds: [$2]
            });
        }), 1200);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield interaction.editReply({
                embeds: [$3]
            });
        }), 1800);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            var $4 = new discord_js_1.MessageEmbed()
                .setTitle(`Păcănele - Bet: ${bet}`)
                .setDescription("🢂 | " + $ + " | " + $$ + " | " + $$$ + " | 🢀")
                .setColor('RANDOM');
            if ($ == $$ && $$ == $$$) {
                if ($ == "🍇") {
                    const win = (bet + 7) - bet;
                    $4.setFooter(`Ai castigat: 7 BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                    yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { $inc: { bistari: win } });
                }
                else if ($ == "🍉") {
                    const win = (bet * 2) - bet;
                    $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                    yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { $inc: { bistari: win } });
                }
                else if ($ == "🍒") {
                    const win = (bet * 3) - bet;
                    $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                    yield userschema_1.default.findOneAndUpdate({ user_id: (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id }, { $inc: { bistari: win } });
                }
                else if ($ == "🍋") {
                    const win = (bet * 5) - bet;
                    $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                    yield userschema_1.default.findOneAndUpdate({ user_id: (_d = interaction.member) === null || _d === void 0 ? void 0 : _d.user.id }, { $inc: { bistari: win } });
                }
                else if ($ == serverDbDoc.slots_jackpot_emoji) {
                    const win = (bet * 10) - bet;
                    $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                    yield userschema_1.default.findOneAndUpdate({ user_id: (_e = interaction.member) === null || _e === void 0 ? void 0 : _e.user.id }, { $inc: { bistari: win } });
                }
                else if ($ == "🍀") {
                    $4.setFooter(`Andreea a luat ban si nu ai castigat nimic. Acum ai: ${bistari} BI$TARI.`);
                    (_g = (_f = index_1.client.guilds.cache.get(utils.KAYU_SERVER_ID)) === null || _f === void 0 ? void 0 : _f.members.cache.get(utils.DEEYUH_ID)) === null || _g === void 0 ? void 0 : _g.kick("🢂 🍀 🍀 🍀 🢀").catch((error) => __awaiter(void 0, void 0, void 0, function* () {
                        $4.setFooter(`Eroare la Ban Andreea! Ai primit: ${bet} BI$TARI inapoi.`);
                    }));
                }
            }
            else if ($ == $$ || $$ == $$$) {
                const win = Math.ceil((bet * 1.5) - bet);
                $4.setFooter(`Ai castigat ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`);
                yield userschema_1.default.findOneAndUpdate({ user_id: (_h = interaction.member) === null || _h === void 0 ? void 0 : _h.user.id }, { $inc: { bistari: win } });
            }
            else {
                $4.setFooter(`Ai pierdut ${bet} BI$TARI!\nAcum ai: ${bistari - bet} BI$TARI.`);
                yield userschema_1.default.findOneAndUpdate({ user_id: (_j = interaction.member) === null || _j === void 0 ? void 0 : _j.user.id }, { $inc: { bistari: -bet } });
            }
            yield interaction.editReply({
                embeds: [$4]
            });
        }), 2400);
    })
};
