import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import ticketschema from "../../schemas/ticketschema";
import * as utils from "../../utils";

export default {
    category: "Economy",
    description: "Vezi ce poti sa mperi",

    slash: true,

    options: [{
        name: "id",
        description: "ID la ce vrei sa cumperi.",
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

        const ticketDbDoc = await ticketschema.findOne({ 'id': id })

        if (ticketDbDoc == null) {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste /shop ca sa vezi ce poti cumpara.**`,
                ephemeral: true,
            })

            return
        }

        var itemName = ticketDbDoc.name
        var vanityName = ticketDbDoc.vanity_name
        var itemPrice = ticketDbDoc.shop_price

        if (cmdAuthorDbDoc.bistari < itemPrice) {
            interaction.reply({
                content: `**Sarakule nu ai destui BI$TARI. Itemu' ala costa** ${itemPrice} **BI$TARI si tu ai** ${cmdAuthorDbDoc.bistari}`,
                ephemeral: true,
            })

            return
        }

        const newBistari = bistari - itemPrice
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
        );

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { [itemName]: 1 } }
        );

        interaction.reply({
            content: `**Felicitari! Ai cumparat:** ${vanityName}`
        })

    }

} as ICommand