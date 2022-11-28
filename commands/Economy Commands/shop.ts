import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";

export default {
    category: "Economy",
    description: "Vezi ce poti sa mperi",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const bistari = cmdAuthorDbDoc.bistari

        const BAN_ANDREEA_TICKET_PRICE = serverDbDoc.ban_andreea_ticket_price
        const ESCAPE_TICKET_PRICE = serverDbDoc.escape_ticket_price
        const SPEAK_TICKET_PRICE = serverDbDoc.speak_ticket_price
        const MODIFY_SERVER_TICKET_PRICE = serverDbDoc.modify_server_ticket_price
        const TRAP_TICKET_PRICE = serverDbDoc.trap_ticket_price
        const STFU_TICKET_PRICE = serverDbDoc.stfu_ticket_price
        const NADIR_TICKET_PRICE = serverDbDoc.nadir_ticket_price

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`Bun venit la Shop [-] Foloseste /buy <ID> [-] Momentan ai ${bistari} BI$TARI`)
            .addField(`🎟️ Ban Andreea Ticket (ID: 0)`, `ㅤ ↳ **Pret:** ${BAN_ANDREEA_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Da-i ban lu deeyuh. \nㅤ ↳ **Usage:** /banandreea`, false)
            .addField(`🎟️ Trap Ticket (ID: 1)`, `ㅤ ↳ **Pret:** ${TRAP_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Cand trapul e activ, oricine scrie un mesaj are 5% sa devina Nadir. \nㅤ ↳ **Usage:** /trap`, false)
            .addField(`🎟️ Modify Server Ticket (ID: 2)`, `ㅤ ↳ **Pret:** ${MODIFY_SERVER_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Modifica numele serverului o data. \nㅤ ↳ **Usage:** /servername`, false)
            .addField(`🎟️ Nadir Ticket (ID: 3)`, `ㅤ ↳ **Pret:** ${NADIR_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Fa pe cineva Nadir. \nㅤ ↳ **Usage:** /nadir`, false)
            .addField(`🎟️ Escape Ticket (ID: 4)`, `ㅤ ↳ **Pret:** ${ESCAPE_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Scapa de rolul de Nadir. \nㅤ ↳ **Usage:** /escape`, false)
            .addField(`🎟️ STFU Ticket (ID: 5)`, `ㅤ ↳ **Pret:** ${STFU_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Fa pe cineva sa poata vorbi doar prin attachments. \nㅤ ↳ **Usage:** /stfu`, false)
            .addField(`🎟️ Speak Ticket (ID: 6)`, `ㅤ ↳ **Pret:** ${SPEAK_TICKET_PRICE} BI$TARI. \nㅤ ↳ **Info:** Daca a folosit cineva STFU pe tine, poti sa vorbesti din nou. \nㅤ ↳ **Usage:** /speak`, false)
        
        interaction.reply({
            embeds: [embed]
        })
    }

} as ICommand