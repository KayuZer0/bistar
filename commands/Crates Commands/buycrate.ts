import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import ticketschema from "../../schemas/ticketschema";
import * as utils from "../../utils";
import crateschema from "../../schemas/crateschema";

export default {
    category: "Crates",
    description: "Cumpara un crate frate",

    slash: true,

    options: [{
        name: "id",
        description: "ID la ce crate vrei sa cumperi.",
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
        var bistari = cmdAuthorDbDoc.bistari

        const crateDbDoc = await crateschema.findOne({ 'id': id })

        if (crateDbDoc == null) {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste** /crates **ca sa vezi ce crateuri poti cumpara.**`,
                ephemeral: true,
            })

            return
        }

        var itemName = crateDbDoc.name
        var vanityName = crateDbDoc.vanity_name
        var vanityEmoji = crateDbDoc.vanity_emoji
        var itemPrice = crateDbDoc.price

        if (cmdAuthorDbDoc.premium_points < itemPrice) {
            interaction.reply({
                content: `**Sarakule nu ai destule Premium Points. Crateu' ala costa** ${itemPrice} ${serverDbDoc.pp_emoji} **si tu ai** ${cmdAuthorDbDoc.premium_points}`,
                ephemeral: true,
            })

            return
        }

        const newPp = cmdAuthorDbDoc.premium_points - itemPrice
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { premium_points: newPp }
        );

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { [itemName]: 1 } }
        );

        interaction.reply({
            content: `**Felicitari! Ai cumparat:** ${vanityEmoji} ${vanityName} **pentru** ${itemPrice} ${serverDbDoc.pp_emoji}\n`
        })

    }

} as ICommand