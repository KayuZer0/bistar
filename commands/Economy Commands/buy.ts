import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
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

        var itemName = "NOTHING"
        var vanityName = ""
        var itemPrice = 0
        var tickets = 0

        switch (id) {
            case 0:
                itemName = "ban_andreea_tickets"
                vanityName = "🎟️ Ban Andreea Ticket (ID: 0)"
                tickets = cmdAuthorDbDoc.ban_andreea_tickets
                itemPrice = serverDbDoc.ban_andreea_ticket_price
                break;
            case 1:
                itemName = "trap_tickets"
                vanityName = "🎟️ Trap Ticket (ID: 1)"
                tickets = cmdAuthorDbDoc.trap_tickets
                itemPrice = serverDbDoc.trap_ticket_price
                break;
            case 2:
                itemName = "modify_server_tickets"
                vanityName = "🎟️ Modify Server Ticket (ID: 2)"
                tickets = cmdAuthorDbDoc.modify_server_tickets
                itemPrice = serverDbDoc.modify_server_ticket_price
                break;
            case 3:
                itemName = "nadir_tickets"
                vanityName = "🎟️ Nadir Ticket (ID: 3)"
                tickets = cmdAuthorDbDoc.nadir_tickets
                itemPrice = serverDbDoc.nadir_ticket_price
                break;
            case 4:
                itemName = "escape_nadir_tickets"
                vanityName = "🎟️ Escape Ticket (ID: 4)"
                tickets = cmdAuthorDbDoc.escape_nadir_tickets
                itemPrice = serverDbDoc.escape_ticket_price
                break;
            case 5:
                itemName = "taci_tickets"
                vanityName = "🎟️ STFU Ticket (ID: 5)"
                tickets = cmdAuthorDbDoc.taci_tickets
                itemPrice = serverDbDoc.stfu_ticket_price
                break;
            case 6:
                itemName = "nu_tac_tickets"
                vanityName = "🎟️ Speak Ticket (ID: 6)"
                tickets = cmdAuthorDbDoc.nu_tac_tickets
                itemPrice = serverDbDoc.speak_ticket_price
                break;
            default:
                itemName = "NOTHING"
                break;
        }

        if (itemName == "NOTHING") {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste /shop ca sa vezi ce poti cumpara.**`,
                ephemeral: true,
            })

            return
        }

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

        const newTickets = tickets + 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $set: { [itemName]: newTickets } }
        );

        interaction.reply({
            content: `**Felicitari! Ai cumparat:** ${vanityName}`
        })

    }

} as ICommand