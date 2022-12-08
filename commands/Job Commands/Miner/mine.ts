import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../../utils";
import mongoose from "mongoose";
import serverschema from "../../../schemas/serverschema";
import userschema from "../../../schemas/userschema";
import minerschema from "../../../schemas/minerschema";
import oreschema from "../../../schemas/oreschema";
import jobschema from "../../../schemas/jobschema";

export default {
    category: "Job Miner",
    description: "Mineaza niste minereuri calificate.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        if (cmdAuthorDbDoc.job != 1) {
            interaction.reply({
                content: `**Unde te duci bai haladitule daca nu esti Miner? Foloseste** /jobs`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const minerDbDoc = await minerschema.findOne({ 'skill': cmdAuthorDbDoc.miner_skill })

        if (minerDbDoc == null) {
            return
        }

        let max_ores = minerDbDoc.max_ores
        let chances = [minerDbDoc.coal_chance, minerDbDoc.copper_chance, minerDbDoc.iron_chance, minerDbDoc.gold_chance, minerDbDoc.diamond_chance, minerDbDoc.emerald_chance, minerDbDoc.pp_chance]
        let ores = []

        const m1 = new MessageEmbed()
            .setTitle(`Ai inceput sa minezi. Asteapta sa vezi ce ai gasit.`)
            .setImage(serverDbDoc.mine_gif_url)

        await interaction.reply({
            embeds: [m1]
        })

        for (var i = 0; i < max_ores; i++) {
            let ore = utils.percentageChance(['coal', 'copper', 'iron', 'gold', 'diamond', 'emerald', 'premium_points'], chances)

            const oresDbDoc = await oreschema.findOne({ 'name': ore })

            await userschema.findOneAndUpdate(
                { user_id: interaction.user.id },
                { $inc: { [ore]: 1 } }
            );

            ores.push(`**${oresDbDoc?.vanity_emoji} ${oresDbDoc?.vanity_name}** x1`)

        }

        const rp = utils.GetRandomNumber(1, 4) + cmdAuthorDbDoc.miner_skill
        await userschema.findOneAndUpdate(
            { user_id: interaction.user.id },
            { $inc: { respect_points: rp } }
        );

        ores.push(`:star: **Respect Points** x${rp}`)

        let finalOres = []
        for (var i = 0; i < ores.length; i++) {
            finalOres.push(`**+** ${ores[i]}\n`)
        }

        const m2 = new MessageEmbed()
            .setTitle(`Ai terminat de minat!`)
            .setDescription(finalOres.toString().replaceAll(`,`, ``))

        setTimeout(async () => {
            await interaction.editReply({
                embeds: [m2]
            })
        }, 4200);

        await userschema.findOneAndUpdate(
            { user_id: interaction.user.id },
            { $inc: { miner_worked: 1 } }
        );
    }

} as ICommand