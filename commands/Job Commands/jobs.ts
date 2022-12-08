import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import ticketschema from "../../schemas/ticketschema";
import jobschema from "../../schemas/jobschema";
import * as utils from "../../utils";

export default {
    category: "Jobs",
    description: "Vezi la ce joburi poti sa lucrezi.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const bistari = cmdAuthorDbDoc.bistari
        const jobName = (await jobschema.findOne({ 'job_id': cmdAuthorDbDoc.job }))?.vanity_name

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`Lista de joburi [-] /getjob <ID> [-] Momentan esti ${jobName}`)
            .addField(`${(await jobschema.findOne({ 'job_id': 1 }))?.vanity_emoji} **${(await jobschema.findOne({ 'job_id': 1 }))?.vanity_name} (ID: 1)**`, `\nㅤ ↳ **Info:** ${(await jobschema.findOne({ 'job_id': 1 }))?.info} \nㅤ ↳ **Comenzi:** ${(await jobschema.findOne({ 'job_id': 1 }))?.commands} \nㅤ ↳ **Tip:** ${(await jobschema.findOne({ 'job_id': 1 }))?.type}`, false)
            // .addField(`${(await jobschema.findOne({ 'job_id': 2 }))?.vanity_emoji} **${(await jobschema.findOne({ 'job_id': 2 }))?.vanity_name} (ID: 2)**`, `\nㅤ ↳ **Info:** ${(await jobschema.findOne({ 'job_id': 2 }))?.info} \nㅤ ↳ **Comenzi:** ${(await jobschema.findOne({ 'job_id': 2 }))?.commands} \nㅤ ↳ **Tip:** ${(await jobschema.findOne({ 'job_id': 2 }))?.type}`, false)
            .setFooter(`O sa mai vina joburi da simcer acuma nu mai am chef sa fac.`)

        interaction.reply({
            embeds: [embed]
        })
    }

} as ICommand