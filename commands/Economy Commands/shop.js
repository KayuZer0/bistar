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
const ticketschema_1 = __importDefault(require("../../schemas/ticketschema"));
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "Economy",
    description: "Vezi ce poti sa mperi",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            console.log('cox');
            return;
        }
        const bistari = cmdAuthorDbDoc.bistari;
        yield interaction.deferReply();
        const ticket1 = yield ticketschema_1.default.findOne({ 'id': 0 });
        const ticket2 = yield ticketschema_1.default.findOne({ 'id': 1 });
        const ticket3 = yield ticketschema_1.default.findOne({ 'id': 2 });
        const ticket4 = yield ticketschema_1.default.findOne({ 'id': 3 });
        if (ticket1 == null || ticket2 == null || ticket3 == null || ticket4 == null) {
            return;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor()) //! ${(await ticketschema.findOne({ 'id': 0 }))?.shop_price}
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} ${serverDbDoc.bistar_emoji}`)
            .addField(`${ticket1.vanity_name} (ID: 0)`, `ㅤ ↳ **Pret:** ${ticket1.shop_price} ${serverDbDoc.bistar_emoji} \nㅤ ↳ **Info:** ${ticket1.info} \nㅤ ↳ **Usage:** ${ticket1.usage}`, false)
            .addField(`${ticket2.vanity_name} (ID: 1)`, `ㅤ ↳ **Pret:** ${ticket2.shop_price} ${serverDbDoc.bistar_emoji} \nㅤ ↳ **Info:** ${ticket2.info} \nㅤ ↳ **Usage:** ${ticket2.usage}`, false)
            .addField(`${ticket3.vanity_name} (ID: 2)`, `ㅤ ↳ **Pret:** ${ticket3.shop_price} ${serverDbDoc.bistar_emoji} \nㅤ ↳ **Info:** ${ticket3.info} \nㅤ ↳ **Usage:** ${ticket3.usage}`, false)
            .addField(`${ticket4.vanity_name} (ID: 3)`, `ㅤ ↳ **Pret:** ${ticket4.shop_price} ${serverDbDoc.bistar_emoji} \nㅤ ↳ **Info:** ${ticket4.info} \nㅤ ↳ **Usage:** ${ticket4.usage}`, false);
        interaction.editReply({
            embeds: [embed]
        });
    })
};
