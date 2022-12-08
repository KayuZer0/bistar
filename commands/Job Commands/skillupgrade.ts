import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import jobschema from "../../schemas/jobschema";

export default {
    category: "Help",
    description: "Vezi comensile boss",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const job = cmdAuthorDbDoc.job

        if (job == 0) {
            interaction.reply({
                content: `**La ce vrei sa cresti skillu daca nu ai job? Foloseste** /jobs`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const jobsDbDoc = await jobschema.findOne({ 'job_id': job })
        if (jobsDbDoc == null) {
            interaction.reply({
                content: `**Frate s-a produs o eroare pentru ca jobul tau e invalid. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }

        const jobSkillName = jobsDbDoc.skill_name
        const jobName = jobsDbDoc.name
        const jobVanityName = jobsDbDoc.vanity_name

        const jobWorkedQuery = jobName + '_worked'
        const jobWorked = cmdAuthorDbDoc.get(jobWorkedQuery)

        const workedForNextSkillQuery = 'worked_for_skill_' + (cmdAuthorDbDoc.get(jobSkillName) + 1).toString()
        const workedForNextSkill = jobsDbDoc.get(workedForNextSkillQuery)

        if (cmdAuthorDbDoc.get(jobSkillName) == 6) {
            interaction.reply({
                content: `**La ce vrei sa cresti skillu daca deja ai Skill 6?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        if (jobWorked < workedForNextSkill) {
            interaction.reply({
                content: `**Unde te grabesti asa serifule? Nu ai lucrat de suficiente ori ca sa upgradezi skillu. Ai lucrat:** ${jobWorked}/${workedForNextSkill}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const price = cmdAuthorDbDoc.get(jobSkillName) * jobsDbDoc.base_price_per_skill

        if (cmdAuthorDbDoc.bistari < price) {
            interaction.reply({
                content: `**Unde te grabesti asa serifule? Nu ai destui BI$TARI ca sa upgradezi skillu. Ai doar:** ${cmdAuthorDbDoc.bistari}`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const newBistari = cmdAuthorDbDoc.bistari - price
        await userschema.findOneAndUpdate(
            { user_id: interaction.user.id },
            { $set: { bistari: newBistari } }
        );

        const newSkill = cmdAuthorDbDoc.get(jobSkillName) + 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.user.id },
            { $set: { [jobSkillName]: newSkill } }
        );

        interaction.reply({
            content: `**Holy fucking shit ti-ai upgradad skillul la ${jobVanityName} si acum ai Skill** ${newSkill}`,
            files: ['./resources/mamacoaie.jpg'],
            ephemeral: true,
        })

        return

    }

} as ICommand