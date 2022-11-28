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
const utils = __importStar(require("../../utils"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
exports.default = {
    category: "Economy",
    description: "Deschide Gift Box si vezi ce primesti.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        let authorBistari = cmdAuthorDbDoc.bistari;
        let authorGiftPoints = cmdAuthorDbDoc.gift_points;
        const giftBoxPrice = serverDbDoc.giftbox_price;
        if (authorGiftPoints < giftBoxPrice) {
            yield interaction.reply({
                content: `**Bai paranghelie, nu ai destule Gift Points. Momentai ai doar:** ${cmdAuthorDbDoc.gift_points}/${giftBoxPrice}`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });
            return;
        }
        const rng = Math.random();
        let prizeMessage = "";
        if (rng < 0.5) {
            prizeMessage = "Nimic";
        }
        else if (rng > 0.5 && rng < 0.7) {
            let amountWon = utils.GetRandomNumber(500, 2001);
            const newAuthorBistari = authorBistari + amountWon;
            yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { bistari: newAuthorBistari });
            prizeMessage = `${amountWon} **BI$TARI**`;
        }
        else {
            const ticketNames = ["ban_andreea_tickets", "trap_tickets", "modify_server_tickets", "nadir_tickets", "escape_nadir_tickets", "taci_tickets", "nu_tac_tickets"];
            const ticketVanityNames = ["🎟️ Ban Andreea Ticket (ID: 0)", "🎟️ Trap Ticket (ID: 1)", "🎟️ Modify Server Ticket (ID: 2)", "🎟️ Nadir Ticket (ID: 3)", "🎟️ Escape Ticket (ID: 4)", "🎟️ STFU Ticket (ID: 5)", "🎟️ Speak Ticket (ID: 6)"];
            let rand = utils.GetRandomNumber(0, 7);
            const ticketWon = ticketNames[rand];
            prizeMessage = `${ticketVanityNames[rand]}`;
            yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { $inc: { [ticketWon]: 1 } });
        }
        const newGiftPoints = authorGiftPoints - giftBoxPrice;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_c = interaction.member) === null || _c === void 0 ? void 0 : _c.user.id }, { gift_points: newGiftPoints });
        interaction.reply({
            content: `**Ai deschis Gift Boxul si ai primit: **${prizeMessage} \n**Acum ai** ${newGiftPoints} **Gift Points.**`,
        });
    })
};
