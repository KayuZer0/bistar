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
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            console.log('cox');
            return;
        }
        const bistari = cmdAuthorDbDoc.bistari;
        const embed = new discord_js_1.MessageEmbed()
            .setColor(utils.GenerateColor()) //! ${(await ticketschema.findOne({ 'id': 0 }))?.shop_price}
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} ${serverDbDoc.bistar_emoji}`)
            .addField(`${(_a = (yield ticketschema_1.default.findOne({ 'id': 0 }))) === null || _a === void 0 ? void 0 : _a.vanity_name} (ID: 0)`, `ㅤ ↳ **Pret:** ${(_b = (yield ticketschema_1.default.findOne({ 'id': 0 }))) === null || _b === void 0 ? void 0 : _b.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_c = (yield ticketschema_1.default.findOne({ 'id': 0 }))) === null || _c === void 0 ? void 0 : _c.info} \nㅤ ↳ **Usage:** ${(_d = (yield ticketschema_1.default.findOne({ 'id': 0 }))) === null || _d === void 0 ? void 0 : _d.usage}`, false)
            .addField(`${(_e = (yield ticketschema_1.default.findOne({ 'id': 1 }))) === null || _e === void 0 ? void 0 : _e.vanity_name} (ID: 1)`, `ㅤ ↳ **Pret:** ${(_f = (yield ticketschema_1.default.findOne({ 'id': 1 }))) === null || _f === void 0 ? void 0 : _f.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_g = (yield ticketschema_1.default.findOne({ 'id': 1 }))) === null || _g === void 0 ? void 0 : _g.info} \nㅤ ↳ **Usage:** ${(_h = (yield ticketschema_1.default.findOne({ 'id': 1 }))) === null || _h === void 0 ? void 0 : _h.usage}`, false)
            .addField(`${(_j = (yield ticketschema_1.default.findOne({ 'id': 2 }))) === null || _j === void 0 ? void 0 : _j.vanity_name} (ID: 2)`, `ㅤ ↳ **Pret:** ${(_k = (yield ticketschema_1.default.findOne({ 'id': 2 }))) === null || _k === void 0 ? void 0 : _k.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_l = (yield ticketschema_1.default.findOne({ 'id': 2 }))) === null || _l === void 0 ? void 0 : _l.info} \nㅤ ↳ **Usage:** ${(_m = (yield ticketschema_1.default.findOne({ 'id': 2 }))) === null || _m === void 0 ? void 0 : _m.usage}`, false)
            .addField(`${(_o = (yield ticketschema_1.default.findOne({ 'id': 3 }))) === null || _o === void 0 ? void 0 : _o.vanity_name} (ID: 3)`, `ㅤ ↳ **Pret:** ${(_p = (yield ticketschema_1.default.findOne({ 'id': 3 }))) === null || _p === void 0 ? void 0 : _p.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_q = (yield ticketschema_1.default.findOne({ 'id': 3 }))) === null || _q === void 0 ? void 0 : _q.info} \nㅤ ↳ **Usage:** ${(_r = (yield ticketschema_1.default.findOne({ 'id': 3 }))) === null || _r === void 0 ? void 0 : _r.usage}`, false)
            .addField(`${(_s = (yield ticketschema_1.default.findOne({ 'id': 4 }))) === null || _s === void 0 ? void 0 : _s.vanity_name} (ID: 4)`, `ㅤ ↳ **Pret:** ${(_t = (yield ticketschema_1.default.findOne({ 'id': 4 }))) === null || _t === void 0 ? void 0 : _t.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_u = (yield ticketschema_1.default.findOne({ 'id': 4 }))) === null || _u === void 0 ? void 0 : _u.info} \nㅤ ↳ **Usage:** ${(_v = (yield ticketschema_1.default.findOne({ 'id': 4 }))) === null || _v === void 0 ? void 0 : _v.usage}`, false)
            .addField(`${(_w = (yield ticketschema_1.default.findOne({ 'id': 5 }))) === null || _w === void 0 ? void 0 : _w.vanity_name} (ID: 5)`, `ㅤ ↳ **Pret:** ${(_x = (yield ticketschema_1.default.findOne({ 'id': 5 }))) === null || _x === void 0 ? void 0 : _x.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_y = (yield ticketschema_1.default.findOne({ 'id': 5 }))) === null || _y === void 0 ? void 0 : _y.info} \nㅤ ↳ **Usage:** ${(_z = (yield ticketschema_1.default.findOne({ 'id': 5 }))) === null || _z === void 0 ? void 0 : _z.usage}`, false)
            .addField(`${(_0 = (yield ticketschema_1.default.findOne({ 'id': 6 }))) === null || _0 === void 0 ? void 0 : _0.vanity_name} (ID: 6)`, `ㅤ ↳ **Pret:** ${(_1 = (yield ticketschema_1.default.findOne({ 'id': 6 }))) === null || _1 === void 0 ? void 0 : _1.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(_2 = (yield ticketschema_1.default.findOne({ 'id': 6 }))) === null || _2 === void 0 ? void 0 : _2.info} \nㅤ ↳ **Usage:** ${(_3 = (yield ticketschema_1.default.findOne({ 'id': 6 }))) === null || _3 === void 0 ? void 0 : _3.usage}`, false);
        interaction.reply({
            embeds: [embed]
        });
    })
};
