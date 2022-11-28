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
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../../utils"));
exports.default = {
    category: "BI$TAR Perk",
    description: "Califica pe cineva sa fie urmatorul BI$TAR.",
    slash: true,
    callback: ({ channel, interaction, guild, args }) => {
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
        //Command block
        guild === null || guild === void 0 ? void 0 : guild.members.fetch().then((members) => __awaiter(void 0, void 0, void 0, function* () {
            let memberArray = [];
            // await new Promise((resolve) => { })
            members.forEach(member => {
                if (!member.user.bot && member.user.id != utils.KAYU_ID) {
                    if (member.roles.cache.some((role) => role.id === utils.BISTAR_ROLE_ID)) {
                        member.roles.remove(utils.BISTAR_ROLE_ID);
                    }
                    memberArray.push(member.user.id.toString());
                }
            });
            interaction.reply({
                content: `**Ia sa vedem frate pe cine calificam**`,
                files: ['./resources/ochelari.jpg']
            });
            setTimeout(function () {
                var selectedUserID = memberArray[Math.floor(Math.random() * memberArray.length)];
                var selectedMember = guild.members.cache.get(selectedUserID);
                var role = guild.roles.cache.find((role) => role.id === utils.BISTAR_ROLE_ID);
                if (role != undefined) {
                    selectedMember === null || selectedMember === void 0 ? void 0 : selectedMember.roles.add(role);
                }
                channel.send(`**Mama coaie ${selectedMember} a primit rolul de ${role} si acum e foarte calificat**`);
            }, 2000);
        }));
    }
};
