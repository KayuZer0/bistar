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
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "Admin",
    description: "Da Premium Points la toata lumea.",
    slash: true,
    ownerOnly: true,
    options: [{
            name: "amount",
            description: "Cati Premium Points vrei sa dai.",
            type: "INTEGER",
            required: true
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const amountArg = interaction.options.getInteger('amount');
        if (amountArg == null) {
            return;
        }
        yield (yield userschema_1.default.find()).forEach(function (doc) {
            return __awaiter(this, void 0, void 0, function* () {
                const pp = doc.premium_points;
                const newPp = pp + amountArg;
                yield userschema_1.default.findOneAndUpdate({ _id: doc.id }, { premium_points: newPp });
            });
        });
        interaction.reply({
            content: `**Mama bai @everyone smecherosul de KayuZer0 a dat** ${amountArg} ${serverDbDoc.pp_emoji} **la toata lumea gg in chat!**`
        });
    })
};
