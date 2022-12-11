import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../../utils";
import mongoose from "mongoose";
import serverschema from "../../../schemas/serverschema";
import userschema from "../../../schemas/userschema";
import oreschema from "../../../schemas/oreschema";

export default {
    category: "Job Miner",
    description: "Vinde minereurile pentru BI$TARI.",

    slash: true,

    options: [
        {
            name: "name",
            description: "Numele minereului pe care vrei sa-l vinzi.",
            type: "STRING",
            required: true
        },
        {
            name: "amount",
            description: "Cate vrei sa vinzi.",
            type: "INTEGER",
            required: true
        }
    ],

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const nameArg = interaction.options.getString('name')
        const amountArg = interaction.options.getInteger('amount')

        if (nameArg == null || amountArg == null) {
            return
        }

        if (amountArg < 1) {
            interaction.reply({
                content: `**Baiete trebuie sa vinzi cel putin 1 minereu credeam ca e logic.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        const ore = await oreschema.findOne({ 'name': nameArg })

        if (ore == null || nameArg == 'premium_points') {
            interaction.reply({
                content: `**Baiete ai introdus un nume invalid. Foloseste** /myjob **daca esti miner ca sa vezi ce minereuri poti sa vinzi.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        await interaction.deferReply()

        const oresInInv = cmdAuthorDbDoc.get(ore.name)
        var oresToSell = amountArg

        if (amountArg > oresInInv) {
            oresToSell = oresInInv
        }

        const bistariEarned = ore.sell_price * oresToSell
        const newBistari = cmdAuthorDbDoc.bistari + bistariEarned
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: bistariEarned } }
        );

        const newOres = oresInInv - oresToSell
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $set: { [ore.name]: newOres } }
        );

        interaction.editReply({
            content: `**Ai vandut** ${ore.vanity_emoji}${ore.vanity_name} x${oresToSell} **pentru** ${bistariEarned} ${serverDbDoc.bistar_emoji}\n**Acum ai in total:** ${newBistari} ${serverDbDoc.bistar_emoji}`,
            files: ['./resources/bistari.gif'],
        })

    }

} as ICommand