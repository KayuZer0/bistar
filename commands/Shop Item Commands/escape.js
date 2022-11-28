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
exports.default = {
    category: "BI$TAR Shop",
    description: "Escape from being a Nadir.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id });
        if (cmdAuthorDbDoc == null) {
            return;
        }
        const tickets = cmdAuthorDbDoc.escape_nadir_tickets;
        if (!((_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user)) {
            return;
        }
        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Escape Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });
            return;
        }
        let memberRoles = ((_c = interaction.member) === null || _c === void 0 ? void 0 : _c.roles).cache;
        if (!memberRoles.some((role) => role.id === utils.NADIR_ROLE_ID)) {
            interaction.reply({
                content: `**De unde pula mea vrei sa dai escape daca nu esti Nadir? Cox?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            });
            return;
        }
        const newTickets = tickets - 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_d = interaction.member) === null || _d === void 0 ? void 0 : _d.user.id }, { escape_nadir_tickets: newTickets });
        const memberArg = (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.members.cache.get((_f = interaction.member) === null || _f === void 0 ? void 0 : _f.user.id.toString());
        if (memberArg) {
            utils.RemoveNadir(memberArg);
        }
        interaction.reply({
            content: `**Felicitari spre deosebire de Andreea tu acum ai drepturi.**`,
            files: ['./resources/penguin0dance.gif'],
        });
    })
};
