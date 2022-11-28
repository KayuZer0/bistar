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
exports.RestartRainbow = exports.Payday = exports.client = void 0;
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const wokcommands_1 = __importDefault(require("wokcommands"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const serverschema_1 = __importDefault(require("./schemas/serverschema"));
const userschema_1 = __importDefault(require("./schemas/userschema"));
const utils = __importStar(require("./utils"));
dotenv_1.default.config();
var rainbowTimer;
const cron = require('node-cron');
exports.client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS
    ]
});
exports.client.on('guildMemberAdd', (member) => __awaiter(void 0, void 0, void 0, function* () {
    if (!member.user.bot) {
        utils.CreateMemberSchema(member);
    }
}));
exports.client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const guild = exports.client.guilds.cache.get(utils.KAYU_SERVER_ID);
    guild === null || guild === void 0 ? void 0 : guild.members.fetch().then(members => {
        members.forEach(member => {
            if (!member.user.bot) {
                utils.CreateMemberSchema(member);
            }
        });
    });
    (_a = exports.client.user) === null || _a === void 0 ? void 0 : _a.setActivity("cu bi$tarii", {
        type: "PLAYING",
    });
    new wokcommands_1.default(exports.client, {
        commandsDir: path_1.default.join(__dirname, 'commands'),
        typeScript: false,
        mongoUri: process.env.MONGO_URI,
        botOwners: ['415241379866869771']
    })
        .setDefaultPrefix('-');
    StartRainbow();
    cron.schedule('0 * * * *', function () {
        Payday(true);
    });
}));
function Payday(resetMessages) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (yield userschema_1.default.find()).forEach(function (doc) {
            return __awaiter(this, void 0, void 0, function* () {
                const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
                const member = (yield exports.client.guilds.fetch(utils.KAYU_SERVER_ID)).members.fetch(doc.user_id);
                if (serverDbDoc == null) {
                    return;
                }
                let paydayBistari = serverDbDoc.bistari_per_message;
                let paydayGiftPoints = serverDbDoc.giftpoints_per_payday;
                const bistarPaydayMultiplier = serverDbDoc.bistar_payday_multiplier;
                const giftBoxPrice = serverDbDoc.giftbox_price;
                let memberRoles = (yield member).roles.cache;
                if (memberRoles.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
                    paydayBistari = paydayBistari * bistarPaydayMultiplier;
                    paydayGiftPoints = paydayGiftPoints * bistarPaydayMultiplier;
                }
                const bistari = doc.bistari;
                const payday = doc.messages_sent * paydayBistari;
                const newBistari = bistari + payday;
                yield userschema_1.default.findOneAndUpdate({ _id: doc.id }, { bistari: newBistari });
                const newGiftPoints = doc.gift_points + paydayGiftPoints;
                yield userschema_1.default.findOneAndUpdate({ _id: doc.id }, { gift_points: newGiftPoints });
                const userId = doc.user_id;
                const user = exports.client.users.fetch(doc.user_id).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (user.bot) {
                        return;
                    }
                    const embed = new discord_js_1.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle(`🪙 Your Paycheck has arrived!`)
                        .addField(`Mesaje trimise ora asta:`, `${doc.messages_sent}`, false)
                        .addField(`BI$TARI Primiti:`, `${doc.messages_sent} x ${paydayBistari} = ${payday}`, false)
                        .addField(`BI$TARI Totali:`, `${newBistari}`, false)
                        .addField(`Ai primit 100 Gift Points:`, `${newGiftPoints}/${giftBoxPrice}`, false);
                    let memberRoles = (yield member).roles.cache;
                    if (memberRoles.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
                        embed.setFooter(`Pentru ca esti BI$TAR, ai primit x${bistarPaydayMultiplier} Payday!`);
                    }
                    user.send({ embeds: [embed] }).catch(error => {
                        console.log(`Something went wrong while I tried to send a DM to ${user}`);
                    });
                }));
                if (resetMessages) {
                    yield userschema_1.default.findOneAndUpdate({ _id: doc.id }, { messages_sent: 0 });
                }
            });
        });
    });
}
exports.Payday = Payday;
function RestartRainbow() {
    return __awaiter(this, void 0, void 0, function* () {
        StopRainbow();
        setTimeout(function () {
            StartRainbow();
        }, 1000);
    });
}
exports.RestartRainbow = RestartRainbow;
function StartRainbow() {
    return __awaiter(this, void 0, void 0, function* () {
        const serverDb = yield utils.GetServerDatabase();
        if (serverDb) {
            var databaseRainbowSpeed = serverDb.rainbow_speed;
            var rainbowSpeed = databaseRainbowSpeed * 5 * 60000;
            if (databaseRainbowSpeed == 0) {
                return;
            }
            rainbowTimer = setTimeout(function () {
                ChangeBistarRoleColor();
                StartRainbow();
            }, rainbowSpeed);
        }
    });
}
function StopRainbow() {
    if (rainbowTimer != null) {
        clearTimeout(rainbowTimer);
    }
}
function ChangeBistarRoleColor() {
    const guild = exports.client.guilds.cache.get(utils.KAYU_SERVER_ID);
    const role = guild === null || guild === void 0 ? void 0 : guild.roles.cache.get(utils.BISTAR_ROLE_ID);
    role === null || role === void 0 ? void 0 : role.edit({
        color: utils.GenerateColor()
    });
    console.log(`Color change to ${role === null || role === void 0 ? void 0 : role.color}`);
}
exports.client.on("messageCreate", function (message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const messageAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': message.author.id });
        if (!serverDbDoc) {
            return;
        }
        if (!messageAuthorDbDoc) {
            return;
        }
        console.log(message.content);
        const messagesSent = messageAuthorDbDoc.messages_sent;
        const isBistar = (_a = message.member) === null || _a === void 0 ? void 0 : _a.roles.cache.some((role) => role.id === utils.BISTAR_ROLE_ID);
        const isNadir = (_b = message.member) === null || _b === void 0 ? void 0 : _b.roles.cache.some((role) => role.id === utils.NADIR_ROLE_ID);
        //? Increment messages_sent in the databse
        if (messageAuthorDbDoc) {
            const newMessagesSent = messagesSent + 1;
            yield userschema_1.default.findOneAndUpdate({ user_id: message.author.id }, { messages_sent: newMessagesSent });
        }
        //? Trap logic
        if (serverDbDoc.trap_active && message.author.id != utils.KAYU_ID && !isBistar && !message.author.bot && message.channel.id != utils.NADIR_CHANNEL_ID && message.member) {
            const rand = Math.random();
            if (rand < 0.05) {
                yield serverschema_1.default.findOneAndUpdate({ _id: utils.SERVER_DATABASE_DOCUMENT_ID }, { trap_active: false });
                utils.MakeNadir(message.member);
                message.reply(`**Fraiere era trap pe server acum esti Nadir lmao**`);
                message.author.send("**Pe server era pus un trap si tu l-ai activat. Acum esti Nadir. \nCat timp esti Nadir nu ai acces la niciun canal in afara de Nadir Box \nPentru a scapa de rolul de Nadir, poti cumpara Escape Ticket de pe /shop**");
            }
        }
        //? Punishment for talking on #nadir-box
        if (message.channel.id == utils.NADIR_CHANNEL_ID && !isNadir && !isBistar && message.author.id != utils.KAYU_ID && !message.author.bot && message.member) {
            utils.MakeNadir(message.member);
            message.reply(`**Pentru ca ai indraznit sa vorbesti cu un Nadir, acum si tu esti Nadir. Lmao ce fraer.**`);
        }
        //? Only speaking with attachments logic.
        if (message.author.id != utils.KAYU_ID && !isBistar && !message.author.bot && message.member) {
            if (messageAuthorDbDoc.taci) {
                if (message.attachments.size < 1) {
                    message.delete();
                }
            }
        }
    });
});
exports.client.login(process.env.TOKEN);
