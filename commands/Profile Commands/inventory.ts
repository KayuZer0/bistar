import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";
import { client } from "../../index"

export default {
    category: "Profile",
    description: "Vezi ce iteme ai in Inventar.",

    slash: true,

    options: [{
        name: "user",
        description: "Cui vrei sa vezi statisticile.",
        type: "USER",
        required: false
    }],

    callback: async ({ channel, interaction, args }) => {
        const userArg = interaction.options.getUser('user')

        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (serverDbDoc == null || cmdAuthorDbDoc == null) {
            return
        }

        const giftBoxPrice = serverDbDoc.giftbox_price

        let member
        let banAndreeaTickets
        let trapTickets
        let modifyServerTickets
        let nadirTickets
        let escapeTickets
        let stfuTickets
        let speakTickets

        if (userArg == null) {
            member = interaction.user.username
            banAndreeaTickets = cmdAuthorDbDoc.ban_andreea_tickets
            trapTickets = cmdAuthorDbDoc.trap_tickets
            modifyServerTickets = cmdAuthorDbDoc.modify_server_tickets
            nadirTickets = cmdAuthorDbDoc.nadir_tickets
            escapeTickets = cmdAuthorDbDoc.escape_nadir_tickets
            stfuTickets = cmdAuthorDbDoc.taci_tickets
            speakTickets = cmdAuthorDbDoc.nu_tac_tickets
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

            if (mentionedUserDbDoc == null) {
                return
            }

            member = userArg.username
            banAndreeaTickets = mentionedUserDbDoc.ban_andreea_tickets
            trapTickets = mentionedUserDbDoc.trap_tickets
            modifyServerTickets = mentionedUserDbDoc.modify_server_tickets
            nadirTickets = mentionedUserDbDoc.nadir_tickets
            escapeTickets = mentionedUserDbDoc.escape_nadir_tickets
            stfuTickets = mentionedUserDbDoc.taci_tickets
            speakTickets = mentionedUserDbDoc.nu_tac_tickets
        }

        let inventory = [banAndreeaTickets, trapTickets, modifyServerTickets, nadirTickets, escapeTickets, stfuTickets, speakTickets]
        let vanityInventory = [
            `🎟️ **Ban Andreea Tickets:** ${banAndreeaTickets}`,
            `🎟️ **Trap Tickets:** ${trapTickets}`,
            `🎟️ **Modify Server Tickets:** ${modifyServerTickets}`,
            `🎟️ **Nadir Tickets:** ${nadirTickets}`,
            `🎟️ **Escape Tickets:** ${escapeTickets}`,
            `🎟️ **STFU Tickets:** ${stfuTickets}`,
            `🎟️ **Speak Tickets:** ${speakTickets}`
        ]

        let finalInventory = []

        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i] > 0) {
                finalInventory.push(`${vanityInventory[i]}` + `\n`)
            }
        }

        if (finalInventory.length == 0) {
            finalInventory[0] = `Inventarul tau este gol.`
        }

        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`${member} - Inventory`)
            .setDescription(finalInventory.toString().replaceAll(`,`, ``))

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand