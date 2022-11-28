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
const index = __importStar(require("../../index"));
exports.default = {
    category: "BI$TAR Perk",
    description: "Seteaza viteza la rainbow.",
    slash: true,
    options: [{
            name: "speed",
            description: "Rainbow speed.",
            type: "INTEGER",
            required: true
        }],
    callback: ({ channel, interaction, guild, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let authorRoles = ((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.roles).cache;
        if (!authorRoles.some((role) => role.id === utils.BISTAR_ROLE_ID) && interaction.user.id != utils.KAYU_ID) {
            interaction.reply({
                content: `**Bai nebunule, n-ai tu voie la asa ceva**`,
                ephemeral: true,
                files: ['./resources/muie.jpg'],
            });
            return;
        }
        const speedArg = interaction.options.getInteger("speed");
        if (speedArg != null) {
            if (speedArg < 0 || speedArg > 5) {
                interaction.reply({
                    content: `**Rainbow Speed tre' sa fie intre 0 si 5 (Viteza = Speed * 5 Minute)**`,
                    ephemeral: true,
                    files: ['./resources/ceprost.jpg'],
                });
                return;
            }
            yield serverschema_1.default.findOneAndUpdate({ _id: utils.SERVER_DATABASE_DOCUMENT_ID }, { rainbow_speed: speedArg });
            index.RestartRainbow();
            interaction.reply({
                content: `**Gata coaie asa facem**`,
            });
        }
    })
};
