import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";

export default {
    category: "Profile",
    description: "Da level up daca poti.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const level = cmdAuthorDbDoc.level
        const rp = cmdAuthorDbDoc.respect_points
        const rpToNextLevel = cmdAuthorDbDoc.respect_points_to_next_level

        if (rp < rpToNextLevel) {
            interaction.reply({
                content: `**Unde coxu meu dai tu level up daca nu ai destule Respect Points? Momentan ai:** ${rp}/${rpToNextLevel}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const newLevel = level + 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { level: newLevel }
        );

        const newRP = rp - rpToNextLevel
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { respect_points: newRP }
        );

        const newRpToNextLevel = rpToNextLevel + serverDbDoc.respect_points_increment
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { respect_points_to_next_level: newRpToNextLevel }
        );

        interaction.reply({
            content: `**Holy fucking shit tocmai ai dat level up!**\n**Acum ai Level:** ${newLevel}\n**Respect Points:** ${newRP}`,
            files: ['./resources/mamacoaie.jpg'],
        })

    }

} as ICommand