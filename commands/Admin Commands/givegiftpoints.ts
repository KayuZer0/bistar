import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";

export default {
    category: "Admin",
    description: "Da Gift Points cuiva.",

    slash: true,
    ownerOnly: true,

    options: [
        {
            name: "user",
            description: "Cui vrei sa dai Gift Points.",
            type: "USER",
            required: true
        },
        {
            name: "amount",
            description: "Cati Gift Points vrei sa dai.",
            type: "INTEGER",
            required: true
        }
    ],

    callback: async ({ channel, interaction, args }) => {
        const userArg = interaction.options.getUser('user')
        const amountArg = interaction.options.getInteger('amount')

        if (userArg?.bot) {
            interaction.reply({
                content: `**Baiete nu poti sa dai Gift Points la boti**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }
        
        if (amountArg == null || userArg == null) {
            return
        }

        const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

        if (mentionedUserDbDoc == null) {
            return
        }

        var mentionedUserGiftPoints = mentionedUserDbDoc.gift_points


        if (amountArg < 0) {
            interaction.reply({
                content: `**Ai retardation cum dai Gift Points pe minus?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const newMentionedUserGiftPoints = mentionedUserGiftPoints + amountArg
        await userschema.findOneAndUpdate(
            { user_id: userArg.id },
            { gift_points: newMentionedUserGiftPoints }
        );

        const memberArg = interaction.guild?.members.cache.get(userArg?.id.toString())

        interaction.reply({
            content: `**Holy shit ${memberArg} smecherosul de KayuZer0 ti-a dat** ${amountArg} **Gift Points.**`,
        })

    }

} as ICommand