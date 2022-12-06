import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";
import { client } from "../../index"

export default {
    category: "Profile",
    description: "Vezi statisticile tale sau ale altui user.",

    slash: true,

    options: [{
        name: "user",
        description: "Cui vrei sa vezi statisticile.",
        type: "USER",
        required: false
    }],

    callback: async ({ channel, interaction, args }) => {
        const userArg = interaction.options.getUser('user')

        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const giftBoxPrice = serverDbDoc.giftbox_price

        let member
        let bistari
        let giftPoints

        if (userArg == null) {
            member = interaction.user.username
            bistari = cmdAuthorDbDoc.bistari
            giftPoints = cmdAuthorDbDoc.gift_points
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

            if (mentionedUserDbDoc == null) {
                return
            }

            member = userArg.username
            bistari = mentionedUserDbDoc.bistari
            giftPoints = mentionedUserDbDoc.gift_points
        }
        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`${member} - Stats`)
            .setDescription(`🪙 **BI$TARI:** ${bistari}\n🎁 **Gift Points:** ${giftPoints}/${giftBoxPrice}`)

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand