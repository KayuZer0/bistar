import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import jobschema from "../../schemas/jobschema";
import * as utils from "../../utils";
import { client } from "../../index"
import minerschema from "../../schemas/minerschema";

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

        let member
        let dbDoc

        if (userArg == null) {
            member = interaction.user.username
            dbDoc = cmdAuthorDbDoc
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg?.id })

            if (!mentionedUserDbDoc) {
                interaction.reply({
                    content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                    ephemeral: true,
                })

                return
            }

            member = userArg.username
            dbDoc = mentionedUserDbDoc
        }

        let bistari = dbDoc.bistari
        let premiumPoints = dbDoc.premium_points
        let level = dbDoc.level
        let rp = dbDoc.respect_points
        let rpToNextLevel = dbDoc.respect_points_to_next_level
        let job = dbDoc.job
        let skill

        const jobsDbDoc = await jobschema.findOne({ 'job_id': job })
        if (jobsDbDoc == null) { return }

        //! Poate fac cumva sa nu fie switch case idk
        switch (job) {
            case 0:
                skill = ``
                break
            case 1:
                skill = `\n💪 **Skill:** ${dbDoc.miner_skill}`
                break
            default:
                skill = ``
                break
        }

        const jobName = jobsDbDoc?.vanity_name

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`${member} - Stats`)
            .setDescription(`💵 **BI$TARI:** ${bistari}\n:coin: **Premium Points:** ${premiumPoints}\n\n⚙️ **Level:** ${level}\n⭐ **Respect Points:** ${rp}/${rpToNextLevel}\n\n💼 **Job:** ${jobName}${skill}`)

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand