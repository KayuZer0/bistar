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
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "Profile",
    description: "Vezi ce iteme ai in Inventar.",
    slash: true,
    options: [{
            name: "user",
            description: "Cui vrei sa vezi statisticile.",
            type: "USER",
            required: false
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const userArg = interaction.options.getUser('user');
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const giftBoxPrice = serverDbDoc.giftbox_price;
        let member;
        let banAndreeaTickets;
        let trapTickets;
        let modifyServerTickets;
        let nadirTickets;
        let escapeTickets;
        let stfuTickets;
        let speakTickets;
        if (userArg == null) {
            member = interaction.user.username;
            banAndreeaTickets = cmdAuthorDbDoc.ban_andreea_tickets;
            trapTickets = cmdAuthorDbDoc.trap_tickets;
            modifyServerTickets = cmdAuthorDbDoc.modify_server_tickets;
            nadirTickets = cmdAuthorDbDoc.nadir_tickets;
            escapeTickets = cmdAuthorDbDoc.escape_nadir_tickets;
            stfuTickets = cmdAuthorDbDoc.taci_tickets;
            speakTickets = cmdAuthorDbDoc.nu_tac_tickets;
        }
        else {
            const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
            if (mentionedUserDbDoc == null) {
                return;
            }
            member = userArg.username;
            banAndreeaTickets = mentionedUserDbDoc.ban_andreea_tickets;
            trapTickets = mentionedUserDbDoc.trap_tickets;
            modifyServerTickets = mentionedUserDbDoc.modify_server_tickets;
            nadirTickets = mentionedUserDbDoc.nadir_tickets;
            escapeTickets = mentionedUserDbDoc.escape_nadir_tickets;
            stfuTickets = mentionedUserDbDoc.taci_tickets;
            speakTickets = mentionedUserDbDoc.nu_tac_tickets;
        }
        let inventory = [banAndreeaTickets, trapTickets, modifyServerTickets, nadirTickets, escapeTickets, stfuTickets, speakTickets];
        let vanityInventory = [
            `🎟️ **Ban Andreea Tickets:** ${banAndreeaTickets}`,
            `🎟️ **Trap Tickets:** ${trapTickets}`,
            `🎟️ **Modify Server Tickets:** ${modifyServerTickets}`,
            `🎟️ **Nadir Tickets:** ${nadirTickets}`,
            `🎟️ **Escape Tickets:** ${escapeTickets}`,
            `🎟️ **STFU Tickets:** ${stfuTickets}`,
            `🎟️ **Speak Tickets:** ${speakTickets}`
        ];
        let finalInventory = [];
        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i] > 0) {
                finalInventory.push(`${vanityInventory[i]}` + `\n`);
            }
        }
        if (finalInventory.length == 0) {
            finalInventory[0] = `Inventarul tau este gol.`;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`${member} - Inventory`)
            .setDescription(finalInventory.toString().replaceAll(`,`, ``));
        interaction.reply({
            embeds: [embed]
        });
    })
};
