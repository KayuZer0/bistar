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
    category: "Admin",
    description: "Da Gift Points cuiva.",
    slash: true,
    ownerOnly: true,
    options: [
        {
            name: "user",
            description: "Cui vrei sa dai Gift Points.",
            type: "USER",
            required: true
        },
        {
            name: "amount",
            description: "Cati Gift Points vrei sa dai.",
            type: "INTEGER",
            required: true
        }
    ],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userArg = interaction.options.getUser('user');
        const amountArg = interaction.options.getInteger('amount');
        if (userArg === null || userArg === void 0 ? void 0 : userArg.bot) {
            interaction.reply({
                content: `**Baiete nu poti sa dai Gift Points la boti**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        if (amountArg == null || userArg == null) {
            return;
        }
        const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
        if (mentionedUserDbDoc == null) {
            return;
        }
        var mentionedUserGiftPoints = mentionedUserDbDoc.gift_points;
        if (amountArg < 0) {
            interaction.reply({
                content: `**Ai retardation cum dai Gift Points pe minus?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const newMentionedUserGiftPoints = mentionedUserGiftPoints + amountArg;
        yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { gift_points: newMentionedUserGiftPoints });
        const memberArg = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(userArg === null || userArg === void 0 ? void 0 : userArg.id.toString());
        interaction.reply({
            content: `**Holy shit ${memberArg} smecherosul de KayuZer0 ti-a dat** ${amountArg} **Gift Points.**`,
        });
    })
};
