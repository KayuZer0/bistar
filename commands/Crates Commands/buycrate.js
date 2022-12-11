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
const crateschema_1 = __importDefault(require("../../schemas/crateschema"));
exports.default = {
    category: "Crates",
    description: "Cumpara un crate frate",
    slash: true,
    options: [{
            name: "id",
            description: "ID la ce crate vrei sa cumperi.",
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
        const crateDbDoc = yield crateschema_1.default.findOne({ 'id': id });
        if (crateDbDoc == null) {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste** /crates **ca sa vezi ce crateuri poti cumpara.**`,
                ephemeral: true,
            });
            return;
        }
        var itemName = crateDbDoc.name;
        var vanityName = crateDbDoc.vanity_name;
        var vanityEmoji = crateDbDoc.vanity_emoji;
        var itemPrice = crateDbDoc.price;
        if (cmdAuthorDbDoc.premium_points < itemPrice) {
            interaction.reply({
                content: `**Sarakule nu ai destule Premium Points. Crateu' ala costa** ${itemPrice} ${serverDbDoc.pp_emoji} **si tu ai** ${cmdAuthorDbDoc.premium_points}`,
                ephemeral: true,
            });
            return;
        }
        const newPp = cmdAuthorDbDoc.premium_points - itemPrice;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { premium_points: newPp });
        yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { $inc: { [itemName]: 1 } });
        interaction.reply({
            content: `**Felicitari! Ai cumparat:** ${vanityEmoji} ${vanityName} **pentru** ${itemPrice} ${serverDbDoc.pp_emoji}\n`
        });
    })
};
