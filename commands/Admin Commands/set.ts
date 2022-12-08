import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";

export default {
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

    callback: async ({ channel, interaction, args }) => {
        const userArg = interaction.options.getUser('user')
        const fieldArg = interaction.options.getString('field_name')
        const operationArg = interaction.options.getString('operation')
        const valueArg = interaction.options.getNumber('value')

        const validOperations = ['set', 'increment']

        if (userArg == null || fieldArg == null || operationArg == null || valueArg == null) {
            return
        }

        const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }


        if (mentionedUserDbDoc == null) {
            return
        }

        if (mentionedUserDbDoc.get(fieldArg) == undefined) {
            interaction.reply({
                content: `**Coaie imi pare foarte rau dar** '${fieldArg}' **e un field invalid.**`,
                ephemeral: true,
            })

            return
        }

        if (!validOperations.includes(operationArg)) {
            interaction.reply({
                content: `**Operatia** '${operationArg} **este invalida.** Floseste** 'set/increment'.`,
                ephemeral: true,
            })

            return
        }

        switch (operationArg) {
            case 'set':
                await userschema.findOneAndUpdate(
                    { user_id: interaction.user.id },
                    { $set: { [fieldArg]: valueArg } }
                );
                interaction.reply({
                    content: `**Proprietatea** ${fieldArg} **a lui** ${userArg} **a fost setata la** ${valueArg}`,
                })
                break
            case 'increment':
                await userschema.findOneAndUpdate(
                    { user_id: interaction.user.id },
                    { $inc: { [fieldArg]: valueArg } }
                );
                interaction.reply({
                    content: `**Proprietatea** '${fieldArg}' **a lui** ${userArg} **a fost incrementata cu** ${valueArg}`,
                })
                break
        }

    }

} as ICommand