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
const utils = __importStar(require("../../utils"));
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const index_1 = require("../../index");
exports.default = {
    category: "BI$TAR Shop",
    description: "Seteaza numele la server.",
    slash: true,
    options: [{
            name: "name",
            description: "Numele pe care vrei sa-l pui la server.",
            type: "STRING",
            required: true
        }],
    callback: ({ channel, interaction, guild, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id });
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const tickets = cmdAuthorDbDoc.modify_server_tickets;
        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Modify Server Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });
            return;
        }
        const nameArg = interaction.options.getString('name');
        if (nameArg == null) {
            return;
        }
        const newTickets = tickets - 1;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { modify_server_tickets: newTickets });
        const KAYU_GUILD = yield index_1.client.guilds.cache.get(utils.KAYU_SERVER_ID);
        KAYU_GUILD === null || KAYU_GUILD === void 0 ? void 0 : KAYU_GUILD.setName(nameArg);
        interaction.reply({
            content: `**Gata coaie asa facem am schimbat numele serverului in '${nameArg}'**`
        });
    })
};
