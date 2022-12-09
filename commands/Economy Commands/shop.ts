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

        await interaction.deferReply();

        const ticket1 = await ticketschema.findOne({ 'id': 0 })
        const ticket2 = await ticketschema.findOne({ 'id': 1 })
        const ticket3 = await ticketschema.findOne({ 'id': 2 })
        const ticket4 = await ticketschema.findOne({ 'id': 3 })
        const ticket5 = await ticketschema.findOne({ 'id': 4 })
        const ticket6 = await ticketschema.findOne({ 'id': 5 })
        const ticket7 = await ticketschema.findOne({ 'id': 6 })
        if (ticket1 == null || ticket2 == null || ticket3 == null || ticket4 == null || ticket5 == null || ticket6 == null || ticket7 == null) { return }

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable) //! ${(await ticketschema.findOne({ 'id': 0 }))?.shop_price}
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} ${serverDbDoc.bistar_emoji}`)
            .addField(`${ticket1.vanity_name} (ID: 0)`, `ㅤ ↳ **Pret:** ${ticket1.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket1.info} \nㅤ ↳ **Usage:** ${ticket1.usage}`, false)
            .addField(`${ticket2.vanity_name} (ID: 1)`, `ㅤ ↳ **Pret:** ${ticket2.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket2.info} \nㅤ ↳ **Usage:** ${ticket2.usage}`, false)
            .addField(`${ticket3.vanity_name} (ID: 2)`, `ㅤ ↳ **Pret:** ${ticket3.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket3.info} \nㅤ ↳ **Usage:** ${ticket3.usage}`, false)
            .addField(`${ticket4.vanity_name} (ID: 3)`, `ㅤ ↳ **Pret:** ${ticket4.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket4.info} \nㅤ ↳ **Usage:** ${ticket4.usage}`, false)
            .addField(`${ticket5.vanity_name} (ID: 4)`, `ㅤ ↳ **Pret:** ${ticket5.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket5.info} \nㅤ ↳ **Usage:** ${ticket5.usage}`, false)
            .addField(`${ticket6.vanity_name} (ID: 5)`, `ㅤ ↳ **Pret:** ${ticket6.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket6.info} \nㅤ ↳ **Usage:** ${ticket6.usage}`, false)
            .addField(`${ticket7.vanity_name} (ID: 6)`, `ㅤ ↳ **Pret:** ${ticket7.shop_price} ${serverDbDoc.bistar_emoji}. \nㅤ ↳ **Info:** ${ticket7.info} \nㅤ ↳ **Usage:** ${ticket7.usage}`, false)
        
        interaction.editReply({
            embeds: [embed]
        })
    }

} as ICommand