"use strict";
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
exports.default = {
    category: "Admin",
    description: "Da BI$TARI la toata lumea.",
    slash: true,
    ownerOnly: true,
    options: [{
            name: "amount",
            description: "Cati BI$TARI vrei sa dai.",
            type: "INTEGER",
            required: true
        }],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const amountArg = interaction.options.getInteger('amount');
        if (amountArg == null) {
            return;
        }
        yield (yield userschema_1.default.find()).forEach(function (doc) {
            return __awaiter(this, void 0, void 0, function* () {
                const bistari = doc.bistari;
                const newBistari = bistari + amountArg;
                yield userschema_1.default.findOneAndUpdate({ _id: doc.id }, { bistari: newBistari });
            });
        });
        interaction.reply({
            content: `**Mama bai @everyone smecherosul de KayuZer0 a dat** ${amountArg} **BI$TARI la toata lumea gg in chat!**`
        });
    })
};
