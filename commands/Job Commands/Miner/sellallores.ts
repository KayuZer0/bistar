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

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        var oresToSell = []
        var profit = 0

        await interaction.deferReply()

        for (var i = 0; i < 7; i++) {
            const oreDbDoc = await oreschema.findOne({ 'id': i })
            if (oreDbDoc == null) { return }

            if (oreDbDoc.name == 'premium_points') { continue }

            const amtInInv = cmdAuthorDbDoc.get(oreDbDoc.name)
            if (amtInInv < 1) { continue }

            await userschema.findOneAndUpdate(
                { user_id: interaction.member?.user.id },
                { $inc: { [oreDbDoc.name]: -amtInInv } }
            );

            var bistariEarned = oreDbDoc.sell_price * amtInInv

            profit = profit + bistariEarned

            oresToSell.push(`${oreDbDoc.vanity_emoji} ${oreDbDoc.vanity_name} x${amtInInv} | `)

        }

        if (oresToSell.length == 0) {
            interaction.editReply({
                content: `**Nu ai niciun minereu de vandut.**`,
            })

            return
        }

        oresToSell[oresToSell.length - 1]
        oresToSell[oresToSell.length - 1] = oresToSell[oresToSell.length - 1].slice(0, oresToSell[oresToSell.length - 1].length - 3)

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $set: { bistari: cmdAuthorDbDoc.bistari + profit } }
        );

        interaction.editReply({
            content: `**Ai vandut** ${oresToSell.toString().replaceAll(`,`, ``)} **pentru** ${profit} ${serverDbDoc.bistar_emoji}\n**Acum ai in total:** ${cmdAuthorDbDoc.bistari + profit} ${serverDbDoc.bistar_emoji}`,
            files: ['./resources/bistari.gif'],
        })


        // await interaction.deferReply()

        // const oresInInv = cmdAuthorDbDoc.get(ore.name)
        // var oresToSell = amountArg

        // if (amountArg > oresInInv) {
        //     oresToSell = oresInInv
        // }

        // const bistariEarned = ore.sell_price * oresToSell
        // const newBistari = cmdAuthorDbDoc.bistari + bistariEarned
        // await userschema.findOneAndUpdate(
        //     { user_id: interaction.member?.user.id },
        //     { $inc: { bistari: bistariEarned } }
        // );

        // const newOres = oresInInv - oresToSell
        // await userschema.findOneAndUpdate(
        //     { user_id: interaction.member?.user.id },
        //     { $set: { [ore.name]: newOres } }
        // );

        // interaction.editReply({
        //     content: `**Ai vandut** ${ore.vanity_emoji}${ore.vanity_name} x${oresToSell} **pentru** ${bistariEarned} ${serverDbDoc.bistar_emoji}\n**Acum ai in total:** ${newBistari} ${serverDbDoc.bistar_emoji}`,
        //     files: ['./resources/bistari.gif'],
        // })

    }

} as ICommand