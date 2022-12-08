import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import ticketschema from "../../schemas/ticketschema";
import * as utils from "../../utils";
import jobschema from "../../schemas/jobschema";

export default {
    category: "Jobs",
    description: "Angajeaza-te la un job.",

    slash: true,

    options: [{
        name: "id",
        description: "ID jobului la care vrei sa te angajezi.",
        type: "INTEGER",
        required: true
    }],

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const id = interaction.options.getInteger('id')
        if (id == null) { return }

        const jobsDbDoc = await jobschema.findOne({ 'job_id': id })

        if (id < 1 || jobsDbDoc == null) {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste** /jobs **sa vezi ce joburi exista.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        if (id == cmdAuthorDbDoc.job) {
            interaction.reply({
                content: `**Coxatule deja ai acel job.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        var jobName = jobsDbDoc.name
        var jobVanityName = jobsDbDoc.vanity_name

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $set: { job: id } }
        );

        interaction.reply({
            content: `**Felicitari! Te-ai angajat ca:** ${jobVanityName}`
        })

    }

} as ICommand