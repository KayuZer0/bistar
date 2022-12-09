import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";

export default {
    category: "Economy",
    description: "Vezi ce poti sa cumperi",

    slash: true,

    options: [
        {
            name: "user",
            description: "Cui vrei sa dai BI$TARI.",
            type: "USER",
            required: true
        },
        {
            name: "amount",
            description: "Cati BI$TARI vrei sa dai.",
            type: "INTEGER",
            required: true
        }
    ],

    callback: async ({ channel, interaction, args }) => {       
        const userArg = interaction.options.getUser('user')
        const amountArg = interaction.options.getInteger('amount')
        
        if (amountArg == null || userArg == null) {
            return
        }
        
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })
        const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

        if (cmdAuthorDbDoc == null || mentionedUserDbDoc == null || serverDbDoc == null) {
            return
        }

        var bistari = cmdAuthorDbDoc.bistari
        var mentionedUserBistari = mentionedUserDbDoc.bistari

        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }

        if (amountArg < 0) {
            interaction.reply({
                content: `**Ai retardation cum trimiti BI$TARI pe minus?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        if (bistari < amountArg) {
            interaction.reply({
                content: `**Sarakule nu ai destui BI$TARI. Ai doar** ${bistari} ${serverDbDoc.bistar_emoji}`,
                files: ['./resources/muie.jpg'],
                ephemeral: true,
            })

            return
        }

        const newAuthorBistari = bistari - amountArg
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newAuthorBistari }
        );

        const newMentionedUserBistari = mentionedUserBistari + amountArg
        await userschema.findOneAndUpdate(
            { user_id: userArg.id },
            { bistari: newMentionedUserBistari }
        );

        const memberArg = interaction.guild?.members.cache.get(userArg?.id.toString())

        interaction.reply({
            content: `**Ai trimis cu succes** ${amountArg} ${serverDbDoc.bistar_emoji} **lui ${memberArg}**`,
            files: ['./resources/bistari.gif'],
        })

    }

} as ICommand