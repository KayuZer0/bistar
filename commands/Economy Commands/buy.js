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
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "Economy",
    description: "Vezi ce poti sa mperi",
    slash: true,
    options: [{
            name: "id",
            description: "ID la ce vrei sa cumperi.",
            type: "INTEGER",
            required: true
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const id = interaction.options.getInteger('id');
        var bistari = cmdAuthorDbDoc.bistari;
        var itemName = "NOTHING";
        var vanityName = "";
        var itemPrice = 0;
        var tickets = 0;
        switch (id) {
            case 0:
                itemName = "ban_andreea_tickets";
                vanityName = "🎟️ Ban Andreea Ticket (ID: 0)";
                tickets = cmdAuthorDbDoc.ban_andreea_tickets;
                itemPrice = serverDbDoc.ban_andreea_ticket_price;
                break;
            case 1:
                itemName = "trap_tickets";
                vanityName = "🎟️ Trap Ticket (ID: 1)";
                tickets = cmdAuthorDbDoc.trap_tickets;
                itemPrice = serverDbDoc.trap_ticket_price;
                break;
            case 2:
                itemName = "modify_server_tickets";
                vanityName = "🎟️ Modify Server Ticket (ID: 2)";
                tickets = cmdAuthorDbDoc.modify_server_tickets;
                itemPrice = serverDbDoc.modify_server_ticket_price;
                break;
            case 3:
                itemName = "nadir_tickets";
                vanityName = "🎟️ Nadir Ticket (ID: 3)";
                tickets = cmdAuthorDbDoc.nadir_tickets;
                itemPrice = serverDbDoc.nadir_ticket_price;
                break;
            case 4:
                itemName = "escape_nadir_tickets";
                vanityName = "🎟️ Escape Ticket (ID: 4)";
                tickets = cmdAuthorDbDoc.escape_nadir_tickets;
                itemPrice = serverDbDoc.escape_ticket_price;
                break;
            case 5:
                itemName = "taci_tickets";
                vanityName = "🎟️ STFU Ticket (ID: 5)";
                tickets = cmdAuthorDbDoc.taci_tickets;
                itemPrice = serverDbDoc.stfu_ticket_price;
                break;
            case 6:
                itemName = "nu_tac_tickets";
                vanityName = "🎟️ Speak Ticket (ID: 6)";
                tickets = cmdAuthorDbDoc.nu_tac_tickets;
                itemPrice = serverDbDoc.speak_ticket_price;
                break;
            default:
                itemName = "NOTHING";
                break;
        }
        if (itemName == "NOTHING") {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste /shop ca sa vezi ce poti cumpara.**`,
                ephemeral: true,
            });
            return;
        }
        if (cmdAuthorDbDoc.bistari < itemPrice) {
            interaction.reply({
                content: `**Sarakule nu ai destui BI$TARI. Itemu' ala costa** ${itemPrice} **BI$TARI si tu ai** ${cmdAuthorDbDoc.bistari}`,
                ephemeral: true,
            });
            return;
        }
        const newBistari = bistari - itemPrice;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { bistari: newBistari });
        const newTickets = tickets + 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { $set: { [itemName]: newTickets } });
        interaction.reply({
            content: `**Felicitari! Ai cumparat:** ${vanityName}`
        });
    })
};
