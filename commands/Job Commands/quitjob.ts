import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import jobschema from "../../schemas/jobschema";

export default {
    category: "Jobs",
    description: "Da-ti demisia.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        if (cmdAuthorDbDoc.job == 0) {
            interaction.reply({
                content: `**Baiete cum vrei sa demisionezi daca deja esti ${(await jobschema.findOne({ 'job_id': 0 }))?.vanity_name}?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $set: { job: 0 } }
        );

        interaction.reply({
            content: `**Felicitari! Acum esti:** ${(await jobschema.findOne({ 'job_id': 0 }))?.vanity_name}`
        })
    }

} as ICommand