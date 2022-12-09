import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import crateschema from "../../schemas/crateschema";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";

export default {
    category: "Crates",
    description: "Vezi crateurile pe care poti sa le cumperi.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const pp = cmdAuthorDbDoc.premium_points

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`Crate Place [-] Foloseste /buycrate <ID> [-] Momentan ai ${pp} ${serverDbDoc.pp_emoji}`)
            .addField(`${(await crateschema.findOne({ 'id': 0 }))?.vanity_emoji} ${(await crateschema.findOne({ 'id': 0 }))?.vanity_name} (ID: 0)`, `ㅤ ↳ **Pret:** ${(await crateschema.findOne({ 'id': 0 }))?.price} ${serverDbDoc.pp_emoji}. \nㅤ ↳ **Info:** ${(await crateschema.findOne({ 'id': 0 }))?.info}`, false)

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand