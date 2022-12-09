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
const ticketschema_1 = __importDefault(require("../../schemas/ticketschema"));
const oreschema_1 = __importDefault(require("../../schemas/oreschema"));
const crateschema_1 = __importDefault(require("../../schemas/crateschema"));
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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
        const userArg = interaction.options.getUser('user');
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        let member;
        let dbDoc;
        if (userArg == null) {
            member = interaction.user.username;
            dbDoc = cmdAuthorDbDoc;
        }
        else {
            const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg === null || userArg === void 0 ? void 0 : userArg.id });
            if (!mentionedUserDbDoc) {
                interaction.reply({
                    content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                    ephemeral: true,
                });
                return;
            }
            member = userArg.username;
            dbDoc = mentionedUserDbDoc;
        }
        let inventory = [
            dbDoc.ban_andreea_tickets,
            dbDoc.trap_tickets,
            dbDoc.modify_server_tickets,
            dbDoc.nadir_tickets,
            dbDoc.escape_nadir_tickets,
            dbDoc.taci_tickets,
            dbDoc.nu_tac_tickets,
            dbDoc.coal,
            dbDoc.copper,
            dbDoc.iron,
            dbDoc.gold,
            dbDoc.diamond,
            dbDoc.emerald,
            dbDoc.basic_crates
        ];
        let vanityInventory = [
            `**${(_a = (yield ticketschema_1.default.findOne({ 'id': 0 }))) === null || _a === void 0 ? void 0 : _a.vanity_name}** x${dbDoc.ban_andreea_tickets}`,
            `**${(_b = (yield ticketschema_1.default.findOne({ 'id': 1 }))) === null || _b === void 0 ? void 0 : _b.vanity_name}** x${dbDoc.trap_tickets}`,
            `**${(_c = (yield ticketschema_1.default.findOne({ 'id': 2 }))) === null || _c === void 0 ? void 0 : _c.vanity_name}** x${dbDoc.modify_server_tickets}`,
            `**${(_d = (yield ticketschema_1.default.findOne({ 'id': 3 }))) === null || _d === void 0 ? void 0 : _d.vanity_name}** x${dbDoc.nadir_tickets}`,
            `**${(_e = (yield ticketschema_1.default.findOne({ 'id': 4 }))) === null || _e === void 0 ? void 0 : _e.vanity_name}** x${dbDoc.escape_nadir_tickets}`,
            `**${(_f = (yield ticketschema_1.default.findOne({ 'id': 5 }))) === null || _f === void 0 ? void 0 : _f.vanity_name}** x${dbDoc.taci_tickets}`,
            `**${(_g = (yield ticketschema_1.default.findOne({ 'id': 6 }))) === null || _g === void 0 ? void 0 : _g.vanity_name}** x${dbDoc.nu_tac_tickets}`,
            `${(_h = (yield oreschema_1.default.findOne({ 'id': 0 }))) === null || _h === void 0 ? void 0 : _h.vanity_emoji} **${(_j = (yield oreschema_1.default.findOne({ 'id': 0 }))) === null || _j === void 0 ? void 0 : _j.vanity_name}** x${dbDoc.coal}`,
            `${(_k = (yield oreschema_1.default.findOne({ 'id': 1 }))) === null || _k === void 0 ? void 0 : _k.vanity_emoji} **${(_l = (yield oreschema_1.default.findOne({ 'id': 1 }))) === null || _l === void 0 ? void 0 : _l.vanity_name}** x${dbDoc.copper}`,
            `${(_m = (yield oreschema_1.default.findOne({ 'id': 2 }))) === null || _m === void 0 ? void 0 : _m.vanity_emoji} **${(_o = (yield oreschema_1.default.findOne({ 'id': 2 }))) === null || _o === void 0 ? void 0 : _o.vanity_name}** x${dbDoc.iron}`,
            `${(_p = (yield oreschema_1.default.findOne({ 'id': 3 }))) === null || _p === void 0 ? void 0 : _p.vanity_emoji} **${(_q = (yield oreschema_1.default.findOne({ 'id': 3 }))) === null || _q === void 0 ? void 0 : _q.vanity_name}** x${dbDoc.gold}`,
            `${(_r = (yield oreschema_1.default.findOne({ 'id': 4 }))) === null || _r === void 0 ? void 0 : _r.vanity_emoji} **${(_s = (yield oreschema_1.default.findOne({ 'id': 4 }))) === null || _s === void 0 ? void 0 : _s.vanity_name}** x${dbDoc.diamond}`,
            `${(_t = (yield oreschema_1.default.findOne({ 'id': 5 }))) === null || _t === void 0 ? void 0 : _t.vanity_emoji} **${(_u = (yield oreschema_1.default.findOne({ 'id': 5 }))) === null || _u === void 0 ? void 0 : _u.vanity_name}** x${dbDoc.emerald}`,
            `${(_v = (yield crateschema_1.default.findOne({ 'id': 0 }))) === null || _v === void 0 ? void 0 : _v.vanity_emoji} **${(_w = (yield crateschema_1.default.findOne({ 'id': 0 }))) === null || _w === void 0 ? void 0 : _w.vanity_name}** x${dbDoc.basic_crates}`,
        ];
        let finalInventory = [];
        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i] > 0) {
                finalInventory.push(`${vanityInventory[i]}` + `\n`);
            }
        }
        if (finalInventory.length == 0) {
            finalInventory[0] = `Acest inventar este gol.`;
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
