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
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "BI$TAR Shop",
    description: "Fa pe cineva sa poata vorbi doar cu attachments.",
    slash: true,
    options: [{
            name: "user",
            description: "Useru pe care vrei sa-l faci sa taca.",
            type: "USER",
            required: true
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id });
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const tickets = cmdAuthorDbDoc.taci_tickets;
        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'STFU Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });
            return;
        }
        const userArg = interaction.options.getUser("user");
        if (!userArg) {
            return;
        }
        const mentionedMemberDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
        if (mentionedMemberDbDoc == null) {
            return;
        }
        if ((userArg === null || userArg === void 0 ? void 0 : userArg.id) == utils.KAYU_ID) {
            interaction.reply({
                content: `**Stii ca gen chiar daca il faci pe Edi sa taca tot poate sa vorbeasca ca e sv lui facut de el, nu?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        if (userArg === null || userArg === void 0 ? void 0 : userArg.bot) {
            interaction.reply({
                content: `**Coaie cum pula mea faci tu botu sa taca?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        const memberArg = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userArg === null || userArg === void 0 ? void 0 : userArg.id.toString());
        let memberRoles = (memberArg === null || memberArg === void 0 ? void 0 : memberArg.roles).cache;
        if (memberRoles.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Coaie nu poti sa faci BI$TAR sa taca esti nebun la taraot?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            });
            return;
        }
        if (mentionedMemberDbDoc.taci) {
            interaction.reply({
                content: `**Varule omu ala deja nu poate sa vorbeasca. Ce vrei? Sa taca de 2 ori?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        const newTickets = tickets - 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id }, { taci_tickets: newTickets });
        yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { taci: true });
        interaction.reply({
            content: `**Gata frate de acum ${memberArg} poate sa vorbeasca doar cu attachments lmao.**`,
            files: ['./resources/bro-stfu.gif'],
        });
    })
};
