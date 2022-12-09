import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils"

export default {
    category: "Admin",
    description: "Da Premium Points la toata lumea.",

    slash: true,
    ownerOnly: true,

    options: [{
        name: "amount",
        description: "Cati Premium Points vrei sa dai.",
        type: "INTEGER",
        required: true
    }],

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const amountArg = interaction.options.getInteger('amount')

        if (amountArg == null) {
            return
        }

        await (await userschema.find()).forEach(
            async function (doc) {
                const pp = doc.premium_points

                const newPp = pp + amountArg;
                await userschema.findOneAndUpdate(
                    { _id: doc.id },
                    { premium_points: newPp }
                );
            }
        )

        interaction.reply({
            content: `**Mama bai @everyone smecherosul de KayuZer0 a dat** ${amountArg} ${serverDbDoc.pp_emoji} **la toata lumea gg in chat!**`
        })
    }

} as ICommand