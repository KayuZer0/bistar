import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils";
import userschema from "../../schemas/userschema";

export default {
    category: "Economy",
    description: "Deschide Gift Box si vezi ce primesti.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        let authorBistari = cmdAuthorDbDoc.bistari
        let authorGiftPoints = cmdAuthorDbDoc.gift_points

        const giftBoxPrice = serverDbDoc.giftbox_price

        if (authorGiftPoints < giftBoxPrice) {
            await interaction.reply({
                content: `**Bai paranghelie, nu ai destule Gift Points. Momentai ai doar:** ${cmdAuthorDbDoc.gift_points}/${giftBoxPrice}`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            });

            return
        }

        const rng = Math.random()

        let prizeMessage = ""
        
        if (rng < 0.5) {
            prizeMessage = "Nimic"
        } else if (rng > 0.5 && rng < 0.7) {
            let amountWon = utils.GetRandomNumber(500, 2001)
            const newAuthorBistari = authorBistari + amountWon
            await userschema.findOneAndUpdate(
                { user_id: interaction.member?.user.id },
                { bistari: newAuthorBistari }
            );
            prizeMessage = `${amountWon} **BI$TARI**`
        } else {
            const ticketNames = ["ban_andreea_tickets", "trap_tickets", "modify_server_tickets", "nadir_tickets", "escape_nadir_tickets", "taci_tickets", "nu_tac_tickets"]
            const ticketVanityNames = ["🎟️ Ban Andreea Ticket (ID: 0)", "🎟️ Trap Ticket (ID: 1)", "🎟️ Modify Server Ticket (ID: 2)", "🎟️ Nadir Ticket (ID: 3)", "🎟️ Escape Ticket (ID: 4)", "🎟️ STFU Ticket (ID: 5)", "🎟️ Speak Ticket (ID: 6)"]
            
            let rand = utils.GetRandomNumber(0, 7)
            const ticketWon = ticketNames[rand]

            prizeMessage = `${ticketVanityNames[rand]}`

            await userschema.findOneAndUpdate(
                { user_id: interaction.member?.user.id },
                { $inc: { [ticketWon]: 1 } }
            );
        }

        const newGiftPoints = authorGiftPoints - giftBoxPrice
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { gift_points: newGiftPoints}
        );

        interaction.reply({
            content: `**Ai deschis Gift Boxul si ai primit: **${prizeMessage} \n**Acum ai** ${newGiftPoints} **Gift Points.**`,
        })
        
    }

} as ICommand