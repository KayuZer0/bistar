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
    description: "Fa ce cineva nadir simplu si usor.",
    slash: true,
    options: [{
            name: "user",
            description: "The user you want to make a Nadir.",
            type: "USER",
            required: true
        }],
    callback: ({ interaction }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id });
        if (cmdAuthorDbDoc == null) {
            return;
        }
        const tickets = cmdAuthorDbDoc.nadir_tickets;
        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Nadir Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });
            return;
        }
        const userArg = interaction.options.getUser("user");
        if (!userArg) {
            return;
        }
        if ((userArg === null || userArg === void 0 ? void 0 : userArg.id) == utils.KAYU_ID) {
            interaction.reply({
                content: `**Stii ca gen chiar daca ii dai Nadir lu' Edi tot are acces la toate alea ca e sv lui facut de el, nu?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        if (userArg === null || userArg === void 0 ? void 0 : userArg.bot) {
            interaction.reply({
                content: `**Coaie cum pula mea dai Nadir la bot?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            });
            return;
        }
        const memberArg = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.members.cache.get(userArg === null || userArg === void 0 ? void 0 : userArg.id.toString());
        let memberRoles = (memberArg === null || memberArg === void 0 ? void 0 : memberArg.roles).cache;
        if (memberRoles.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Coaie nu poti sa dai Nadir la BI$TAR esti nebun la taraot?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            });
            return;
        }
        if (memberRoles.some((role) => role.id === utils.NADIR_ROLE_ID)) {
            interaction.reply({
                content: `**Varule cum dai tu Nadir la Nadir?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            });
            return;
        }
        const newTickets = tickets - 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id }, { nadir_tickets: newTickets });
        if (memberArg) {
            utils.MakeNadir(memberArg);
        }
        interaction.reply({
            content: `**Gata coaie ${memberArg} a fost promovat la functia de sclav.**`,
            files: ['./resources/nadir.gif'],
        });
    })
};
