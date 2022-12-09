import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
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

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            console.log('cox')
            return
        }

        const bistari = cmdAuthorDbDoc.bistari

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable) //! ${(await ticketschema.findOne({ 'id': 0 }))?.shop_price}
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} ${serverDbDoc.bistar_emoji}`)
            .addField(`${(await ticketschema.findOne({ 'id': 0 }))?.vanity_name} (ID: 0)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 0 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 0 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 0 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 1 }))?.vanity_name} (ID: 1)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 1 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 1 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 1 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 2 }))?.vanity_name} (ID: 2)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 2 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 2 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 2 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 3 }))?.vanity_name} (ID: 3)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 3 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 3 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 3 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 4 }))?.vanity_name} (ID: 4)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 4 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 4 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 4 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 5 }))?.vanity_name} (ID: 5)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 5 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 5 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 5 }))?.usage}`, false)
            .addField(`${(await ticketschema.findOne({ 'id': 6 }))?.vanity_name} (ID: 6)`, `ㅤ ↳ **Pret:** ${(await ticketschema.findOne({ 'id': 6 }))?.shop_price} BI$TARI. \nㅤ ↳ **Info:** ${(await ticketschema.findOne({ 'id': 6 }))?.info} \nㅤ ↳ **Usage:** ${(await ticketschema.findOne({ 'id': 6 }))?.usage}`, false)
        
        interaction.reply({
            embeds: [embed]
        })
    }

} as ICommand