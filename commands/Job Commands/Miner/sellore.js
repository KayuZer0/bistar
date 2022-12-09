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
const utils = __importStar(require("../../../utils"));
const serverschema_1 = __importDefault(require("../../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../../schemas/userschema"));
const oreschema_1 = __importDefault(require("../../../schemas/oreschema"));
exports.default = {
    category: "Job Miner",
    description: "Vinde minereurile pentru BI$TARI.",
    slash: true,
    options: [
        {
            name: "name",
            description: "Numele minereului pe care vrei sa-l vinzi.",
            type: "STRING",
            required: true
        },
        {
            name: "amount",
            description: "Cate vrei sa vinzi.",
            type: "INTEGER",
            required: true
        }
    ],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return;
        }
        const nameArg = interaction.options.getString('name');
        const amountArg = interaction.options.getInteger('amount');
        if (nameArg == null || amountArg == null) {
            return;
        }
        if (amountArg < 1) {
            interaction.reply({
                content: `**Baiete trebuie sa vinzi cel putin 1 minereu credeam ca e logic.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const ore = yield oreschema_1.default.findOne({ 'name': nameArg });
        if (ore == null || nameArg == 'premium_points') {
            interaction.reply({
                content: `**Baiete ai introdus un nume invalid. Foloseste** /myjob **daca esti miner ca sa vezi ce minereuri poti sa vinzi.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const oresInInv = cmdAuthorDbDoc.get(ore.name);
        if (oresInInv < amountArg) {
            interaction.reply({
                content: `**Baiete nu ai destul ${ore.vanity_emoji} ${ore.vanity_name} in inventar. Momentai ai doar:** ${oresInInv}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            });
            return;
        }
        const bistariEarned = ore.sell_price * amountArg;
        const newBistari = cmdAuthorDbDoc.bistari + bistariEarned;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id }, { $inc: { bistari: bistariEarned } });
        const newOres = oresInInv - amountArg;
        yield userschema_1.default.findOneAndUpdate({ user_id: (_b = interaction.member) === null || _b === void 0 ? void 0 : _b.user.id }, { $set: { [ore.name]: newOres } });
        interaction.reply({
            content: `**Ai vandut** ${ore.vanity_emoji}${ore.vanity_name} x${amountArg} **pentru** ${bistariEarned} ${serverDbDoc.bistar_emoji}\n**Acum ai in total:** ${newBistari} ${serverDbDoc.bistar_emoji}`,
            files: ['./resources/bistari.gif'],
        });
    })
};
