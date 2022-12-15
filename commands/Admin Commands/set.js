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
    description: "Modifica ceva cuiva in baza de date",
    slash: true,
    ownerOnly: true,
    options: [
        {
            name: "user",
            description: "Cui vrei sa setezi.",
            type: "USER",
            required: true
        },
        {
            name: "field_name",
            description: "Ce vrei sa setezi (numele din baza de date).",
            type: "STRING",
            required: true
        },
        {
            name: "operation",
            description: "Ce operatie vrei sa faci (set/increment).",
            type: "STRING",
            required: true
        },
        {
            name: "value",
            description: "Cu cat vrei sa modifici.",
            type: "NUMBER",
            required: true
        }
    ],
    callback: ({ channel, interaction, args }) => __awaiter(void 0, void 0, void 0, function* () {
        const userArg = interaction.options.getUser('user');
        const fieldArg = interaction.options.getString('field_name');
        const operationArg = interaction.options.getString('operation');
        const valueArg = interaction.options.getNumber('value');
        const validOperations = ['set', 'increment'];
        if (userArg == null || fieldArg == null || operationArg == null || valueArg == null) {
            return;
        }
        const mentionedUserDbDoc = yield userschema_1.default.findOne({ 'user_id': userArg.id });
        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            });
            return;
        }
        if (mentionedUserDbDoc == null) {
            return;
        }
        if (mentionedUserDbDoc.get(fieldArg) == undefined) {
            interaction.reply({
                content: `**Coaie imi pare foarte rau dar** '${fieldArg}' **e un field invalid.**`,
                ephemeral: true,
            });
            return;
        }
        if (!validOperations.includes(operationArg.toLowerCase())) {
            interaction.reply({
                content: `**Operatia** '${operationArg}' **este invalida.** **Floseste** 'set/increment'.`,
                ephemeral: true,
            });
            return;
        }
        switch (operationArg) {
            case 'set':
                yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { $set: { [fieldArg]: valueArg } });
                interaction.reply({
                    content: `**Proprietatea** ${fieldArg} **a lui** ${userArg} **a fost setata la** ${valueArg}`,
                });
                break;
            case 'increment':
                yield userschema_1.default.findOneAndUpdate({ user_id: userArg.id }, { $inc: { [fieldArg]: valueArg } });
                interaction.reply({
                    content: `**Proprietatea** '${fieldArg}' **a lui** ${userArg} **a fost incrementata cu** ${valueArg}`,
                });
                break;
        }
    })
};
