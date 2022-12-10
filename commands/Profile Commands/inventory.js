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
                    content: `**Acel user nu exista in baza de date. Incearca din nou si daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
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
        let vanityInventory = [];
        const ticektCursor = yield ticketschema_1.default.find({});
        const oreCursor = yield oreschema_1.default.find({});
        const crateCursor = yield crateschema_1.default.find({});
        if (ticektCursor == null || oreCursor == null || crateCursor == null) {
            interaction.reply({
                content: `**Eroare la incarcearea inventarului. Incearca din nou si daca nu merge da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        yield interaction.deferReply();
        LoadInventory(dbDoc, vanityInventory, interaction, member);
    })
};
function LoadInventory(dbDoc, vanityInventory, interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        const ticketCursor = yield ticketschema_1.default.find({});
        GetTicketInventory(ticketCursor, dbDoc, vanityInventory, interaction, member);
    });
}
function GetTicketInventory(ticketCursor, dbDoc, vanityInventory, interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        const max = yield ticketschema_1.default.findOne().sort({ 'id': -1 }).limit(1);
        if (max == null) {
            return;
        }
        ticketCursor.forEach(function (err, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const ticketDb = yield ticketschema_1.default.findOne({ 'id': id });
                if (ticketDb == null) {
                    console.log('cox ticket');
                    return;
                }
                if (dbDoc.get(ticketDb.name) > 0) {
                    var vanityString = `**${ticketDb.vanity_name}** x${dbDoc.get(ticketDb.name)}\n`;
                    yield vanityInventory.push(vanityString);
                }
                if (id == max.id) {
                    GetOreInventory(dbDoc, vanityInventory, interaction, member);
                }
            });
        });
    });
}
function GetOreInventory(dbDoc, vanityInventory, interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        const oreCursor = yield oreschema_1.default.find({});
        const max = yield oreschema_1.default.findOne().sort({ 'id': -1 }).limit(1);
        if (max == null) {
            return;
        }
        oreCursor.forEach(function (err, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const oreDb = yield oreschema_1.default.findOne({ 'id': id });
                if (oreDb == null) {
                    return;
                }
                if (dbDoc.get(oreDb.name) > 0) {
                    var vanityString = `${oreDb.vanity_emoji} **${oreDb.vanity_name}** x${dbDoc.get(oreDb.name)}\n`;
                    yield vanityInventory.push(vanityString);
                }
                if (id == max.id - 0.5) {
                    GetCrateInventory(dbDoc, vanityInventory, interaction, member);
                }
            });
        });
    });
}
function GetCrateInventory(dbDoc, vanityInventory, interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        const crateCursor = yield crateschema_1.default.find({});
        const max = yield crateschema_1.default.findOne().sort({ 'id': -1 }).limit(1);
        if (max == null) {
            return;
        }
        crateCursor.forEach(function (err, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const crateDb = yield crateschema_1.default.findOne({ 'id': id });
                if (crateDb == null) {
                    return;
                }
                if (dbDoc.get(crateDb.name) > 0) {
                    var vanityString = `${crateDb.vanity_emoji} **${crateDb.vanity_name}** x${dbDoc.get(crateDb.name)}\n`;
                    yield vanityInventory.push(vanityString);
                }
                if (id == max.id) {
                    DisplayInventory(dbDoc, vanityInventory, interaction, member);
                }
            });
        });
    });
}
function DisplayInventory(dbDoc, vanityInventory, interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        if (vanityInventory.length == 0) {
            vanityInventory[0] = `Acest inventar este gol.`;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`${member} - Inventory`)
            .setDescription(vanityInventory.toString().replaceAll(`,`, ``));
        interaction.editReply({
            embeds: [embed]
        });
    });
}
