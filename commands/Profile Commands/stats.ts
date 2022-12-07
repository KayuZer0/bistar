import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import jobschema from "../../schemas/jobschema";
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
        let premiumPoints
        let level
        let rp
        let job
        let skill

        if (userArg == null) {
            member = interaction.user.username
            bistari = cmdAuthorDbDoc.bistari
            premiumPoints = cmdAuthorDbDoc.premium_points
            level = cmdAuthorDbDoc.level
            rp = cmdAuthorDbDoc.respect_points
            job = cmdAuthorDbDoc.job
            skill = cmdAuthorDbDoc.job_skill
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

            if (mentionedUserDbDoc == null) {
                return
            }

            member = userArg.username
            bistari = mentionedUserDbDoc.bistari
            premiumPoints = mentionedUserDbDoc.premium_points
            level = mentionedUserDbDoc.level
            rp = mentionedUserDbDoc.respect_points
            job = mentionedUserDbDoc.job
            skill = mentionedUserDbDoc.job_skill
        }

        const jobsDbDoc = await jobschema.findOne({ 'job_id': job })
        const jobName = jobsDbDoc?.job_name

        if (job == 0) {
            skill = ``
        } else {
            skill = `\n💪 **Skill:** ${skill}`
        }

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`${member} - Stats`)
            .setDescription(`💵 **BI$TARI:** ${bistari}\n:coin: **Premium Points:** ${premiumPoints}\n\n⚙️ **Level:** ${level}\n⭐ **Respect Points:** ${rp}\n\n💼 **Job:** ${jobName}${skill}`)

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand