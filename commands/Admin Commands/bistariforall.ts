import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";

export default {
    category: "Admin",
    description: "Da BI$TARI la toata lumea.",

    slash: true,
    ownerOnly: true,

    options: [{
        name: "amount",
        description: "Cati BI$TARI vrei sa dai.",
        type: "INTEGER",
        required: true
    }],

    callback: async ({ channel, interaction, args }) => {
        const amountArg = interaction.options.getInteger('amount')

        if (amountArg == null) {
            return
        }

        await (await userschema.find()).forEach(
            async function (doc) { 
                const bistari = doc.bistari

                const newBistari = bistari + amountArg;
                await userschema.findOneAndUpdate(
                    { _id: doc.id },
                    { bistari: newBistari }
                );
            }
        )

        interaction.reply({
            content: `**Mama bai @everyone smecherosul de KayuZer0 a dat** ${amountArg} **BI$TARI la toata lumea gg in chat!**`
        })
    }

} as ICommand