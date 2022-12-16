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
exports.percentageChance = exports.GenerateColor = exports.GetRandomNumber = exports.CreateMemberSchema = exports.RemoveNadir = exports.MakeNadir = exports.GetServerDatabase = exports.NadirChannel = exports.NADIR_CHANNEL_ID = exports.SERVER_DATABASE_DOCUMENT_ID = exports.NADIR_ROLE_ID = exports.BISTAR_ROLE_ID = exports.KAYU_SERVER_ID = exports.DEEYUH_ID = exports.KAYU_ID = void 0;
require("dotenv/config");
const serverschema_1 = __importDefault(require("./schemas/serverschema"));
const userschema_1 = __importDefault(require("./schemas/userschema"));
const index_1 = require("./index");
exports.KAYU_ID = "415241379866869771";
exports.DEEYUH_ID = "766336439629643797";
exports.KAYU_SERVER_ID = "688349036763414638";
exports.BISTAR_ROLE_ID = "688351370260119567";
exports.NADIR_ROLE_ID = "960250572294979655";
exports.SERVER_DATABASE_DOCUMENT_ID = "6370c636850e11bea3ac9417";
exports.NADIR_CHANNEL_ID = "1043834690387320872";
function NadirChannel() {
    return __awaiter(this, void 0, void 0, function* () {
        const KAYU_GUILD = yield index_1.client.guilds.cache.get(exports.KAYU_SERVER_ID);
        const NADIR_CHANNEL = KAYU_GUILD === null || KAYU_GUILD === void 0 ? void 0 : KAYU_GUILD.channels.cache.get(exports.NADIR_CHANNEL_ID);
        return NADIR_CHANNEL;
    });
}
exports.NadirChannel = NadirChannel;
function GetServerDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const SERVER_DATABASE = yield serverschema_1.default.findById(exports.SERVER_DATABASE_DOCUMENT_ID);
        return SERVER_DATABASE;
    });
}
exports.GetServerDatabase = GetServerDatabase;
function MakeNadir(member) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const KAYU_GUILD = yield index_1.client.guilds.cache.get(exports.KAYU_SERVER_ID);
        var userRoles = (_a = (yield (KAYU_GUILD === null || KAYU_GUILD === void 0 ? void 0 : KAYU_GUILD.members.fetch(member.user)))) === null || _a === void 0 ? void 0 : _a.roles.cache.map(role => role.id);
        userRoles === null || userRoles === void 0 ? void 0 : userRoles.pop();
        yield userschema_1.default.findOneAndUpdate({ user_id: member.user.id }, { roles_cache: userRoles });
        member === null || member === void 0 ? void 0 : member.roles.set([exports.NADIR_ROLE_ID]);
    });
}
exports.MakeNadir = MakeNadir;
function RemoveNadir(member) {
    return __awaiter(this, void 0, void 0, function* () {
        const memberDbDoc = yield userschema_1.default.findOne({ 'user_id': member.user.id });
        if (memberDbDoc == null) {
            return;
        }
        member === null || member === void 0 ? void 0 : member.roles.set(memberDbDoc.roles_cache);
        yield userschema_1.default.findOneAndUpdate({ user_id: member.user.id }, { roles_cache: [] });
    });
}
exports.RemoveNadir = RemoveNadir;
function CreateMemberSchema(member) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userschema_1.default
            .findOne({ user_id: member.id })
            .select("user_id")
            .lean();
        if (!user && !member.user.bot) {
            new userschema_1.default({
                user_id: member.id,
                bistari: 0,
                premium_points: 0,
                level: 1,
                respect_points: 0,
                respect_points_to_next_level: 10,
                job: 0,
                miner_skill: 1,
                miner_worked: 0,
                miner_worked_to_next_skill: 10,
                coal: 0,
                copper: 0,
                iron: 0,
                gold: 0,
                diamond: 0,
                emerald: 0,
                ban_andreea_tickets: 0,
                modify_server_tickets: 0,
                taci_tickets: 0,
                nu_tac_tickets: 0,
                basic_crates: 0,
                taci: false,
                messages_sent: 0,
            }).save();
        }
    });
}
exports.CreateMemberSchema = CreateMemberSchema;
function GetRandomNumber(min, max) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}
exports.GetRandomNumber = GetRandomNumber;
function GenerateColor() {
    const h = Math.floor(Math.random() * 255);
    const s = 100;
    var l = 50;
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0'); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
exports.GenerateColor = GenerateColor;
function percentageChance(values, chances) {
    for (var i = 0, pool = []; i < chances.length; i++) {
        for (var i2 = 0; i2 < chances[i]; i2++) {
            pool.push(i);
        }
    }
    return values[arrayShuffle(pool)['0']];
}
exports.percentageChance = percentageChance;
;
function arrayShuffle(array) {
    for (var i = 0, length = array.length, swap = 0, temp = ''; i < length; i++) {
        swap = Math.floor(Math.random() * (i + 1));
        temp = array[swap];
        array[swap] = array[i];
        array[i] = temp;
    }
    return array;
}
;
