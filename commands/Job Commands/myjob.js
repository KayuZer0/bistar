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
const utils = __importStar(require("../../utils"));
const serverschema_1 = __importDefault(require("../../schemas/serverschema"));
const userschema_1 = __importDefault(require("../../schemas/userschema"));
const jobschema_1 = __importDefault(require("../../schemas/jobschema"));
const minerschema_1 = __importDefault(require("../../schemas/minerschema"));
const oreschema_1 = __importDefault(require("../../schemas/oreschema"));
exports.default = {
    category: "Jobs",
    description: "Vezi informatiile jobului tau.",
    slash: true,
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const serverDbDoc = yield serverschema_1.default.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID });
        const cmdAuthorDbDoc = yield userschema_1.default.findOne({ 'user_id': interaction.user.id });
        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return;
        }
        const job = cmdAuthorDbDoc.job;
        if (job == 0) {
            interaction.reply({
                content: `**Momentan esti** ${(_a = (yield jobschema_1.default.findOne({ 'job_id': 0 }))) === null || _a === void 0 ? void 0 : _a.vanity_name}. **Foloseste** /jobs`
            });
        }
        if (job == 1) {
            const jobsDbDoc = yield jobschema_1.default.findOne({ 'job_id': 1 });
            const minerDbDoc = yield minerschema_1.default.findOne({ 'skill': cmdAuthorDbDoc.miner_skill });
            if (jobsDbDoc == null || minerDbDoc == null) {
                return;
            }
            let chances = [minerDbDoc.coal_chance, minerDbDoc.copper_chance, minerDbDoc.iron_chance, minerDbDoc.gold_chance, minerDbDoc.diamond_chance, minerDbDoc.emerald_chance, minerDbDoc.pp_chance];
            let workedForNextSkill = `Max`;
            let skillUpgradePrice = ``;
            if (cmdAuthorDbDoc.miner_skill < 6) {
                const workedForNextSkillQuery = 'worked_for_skill_' + (cmdAuthorDbDoc.miner_skill + 1).toString();
                workedForNextSkill = jobsDbDoc === null || jobsDbDoc === void 0 ? void 0 : jobsDbDoc.get(workedForNextSkillQuery);
                skillUpgradePrice = `🏷️ **Pret Skill Upgrade:** ${cmdAuthorDbDoc.miner_skill * jobsDbDoc.base_price_per_skill} ${serverDbDoc.bistar_emoji}\n`;
            }
            yield interaction.deferReply();
            const ore0 = yield oreschema_1.default.findOne({ 'id': 0 });
            const ore1 = yield oreschema_1.default.findOne({ 'id': 1 });
            const ore2 = yield oreschema_1.default.findOne({ 'id': 2 });
            const ore3 = yield oreschema_1.default.findOne({ 'id': 3 });
            const ore4 = yield oreschema_1.default.findOne({ 'id': 4 });
            const ore5 = yield oreschema_1.default.findOne({ 'id': 5 });
            const ore6 = yield oreschema_1.default.findOne({ 'id': 6 });
            if (ore0 == null || ore1 == null || ore2 == null || ore3 == null || ore4 == null || ore5 == null || ore6 == null) {
                return;
            }
            const embed = new discord_js_1.MessageEmbed()
                .setColor(utils.GenerateColor())
                .setTitle(`Jobul tau este:  ${jobsDbDoc === null || jobsDbDoc === void 0 ? void 0 : jobsDbDoc.vanity_emoji} ${jobsDbDoc === null || jobsDbDoc === void 0 ? void 0 : jobsDbDoc.vanity_name}`)
                .setDescription(`:muscle: **Skill:** ${cmdAuthorDbDoc.miner_skill} (Ture: ${cmdAuthorDbDoc.miner_worked}/${workedForNextSkill})\n${skillUpgradePrice}🎒 **Minereuri pe tura:** ${minerDbDoc.max_ores}\n\n**La Jobul de miner poti sa minezi urmatoarele:**
                **${ore0.vanity_emoji} ${ore0.vanity_name}** - **Chance:** ${chances[0]}**%** - **Sells for:** ${ore0.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore1.vanity_emoji} ${ore1.vanity_name}** - **Chance:** ${chances[1]}**%** - **Sells for:** ${ore1.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore2.vanity_emoji} ${ore2.vanity_name}** - **Chance:** ${chances[2]}**%** - **Sells for:** ${ore2.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore3.vanity_emoji} ${ore3.vanity_name}** - **Chance:** ${chances[3]}**%** - **Sells for:** ${ore3.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore4.vanity_emoji} ${ore4.vanity_name}** - **Chance:** ${chances[4]}**%** - **Sells for:** ${ore4.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore5.vanity_emoji} ${ore5.vanity_name}** - **Chance:** ${chances[5]}**%** - **Sells for:** ${ore5.sell_price} ${serverDbDoc.bistar_emoji}
                **${ore6.vanity_emoji} ${ore6.vanity_name}** - **Chance:** ${chances[6]}**%**\n
                **Foloseste comanda** /mine **pentru a mina**
                **Foloseste comanda** /sellore **pentru a vinde minereurile**
                **Foloseste comanda** /skillupgrade **pentru a-ti upgrada skillul**
                `);
            interaction.editReply({
                embeds: [embed]
            });
        }
    })
};
