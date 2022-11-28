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
    category: "Economy",
    description: "Vezi ce poti sa mperi",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const bistari = cmdAuthorDbDoc.bistari;
        const BAN_ANDREEA_TICKET_PRICE = serverDbDoc.ban_andreea_ticket_price;
        const ESCAPE_TICKET_PRICE = serverDbDoc.escape_ticket_price;
        const SPEAK_TICKET_PRICE = serverDbDoc.speak_ticket_price;
        const MODIFY_SERVER_TICKET_PRICE = serverDbDoc.modify_server_ticket_price;
        const TRAP_TICKET_PRICE = serverDbDoc.trap_ticket_price;
        const STFU_TICKET_PRICE = serverDbDoc.stfu_ticket_price;
        const NADIR_TICKET_PRICE = serverDbDoc.nadir_ticket_price;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor())
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} BI$TARI`)
            .addField(`🎟️ Ban Andreea Ticket (ID: 0)`, `ㅤ ↳ **Pret:** ${BAN_ANDREEA_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Da-i ban lu deeyuh. \nㅤ ↳ **Usage:** /banandreea`, false)
            .addField(`🎟️ Trap Ticket (ID: 1)`, `ㅤ ↳ **Pret:** ${TRAP_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Cand trapul e activ, oricine scrie un mesaj are 5% sa devina Nadir. \nㅤ ↳ **Usage:** /trap`, false)
            .addField(`🎟️ Modify Server Ticket (ID: 2)`, `ㅤ ↳ **Pret:** ${MODIFY_SERVER_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Modifica numele serverului o data. \nㅤ ↳ **Usage:** /servername`, false)
            .addField(`🎟️ Nadir Ticket (ID: 3)`, `ㅤ ↳ **Pret:** ${NADIR_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Fa pe cineva Nadir. \nㅤ ↳ **Usage:** /nadir`, false)
            .addField(`🎟️ Escape Ticket (ID: 4)`, `ㅤ ↳ **Pret:** ${ESCAPE_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Scapa de rolul de Nadir. \nㅤ ↳ **Usage:** /escape`, false)
            .addField(`🎟️ STFU Ticket (ID: 5)`, `ㅤ ↳ **Pret:** ${STFU_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Fa pe cineva sa poata vorbi doar prin attachments. \nㅤ ↳ **Usage:** /stfu`, false)
            .addField(`🎟️ Speak Ticket (ID: 6)`, `ㅤ ↳ **Pret:** ${SPEAK_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Daca a folosit cineva STFU pe tine, poti sa vorbesti din nou. \nㅤ ↳ **Usage:** /speak`, false);
        interaction.reply({
            embeds: [embed]
        });
    })
};
