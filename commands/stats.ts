import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../schemas/serverschema";
import userschema from "../schemas/userschema";
import * as utils from "../utils";
import {client} from "../index"

export default {
    category: "Stats",
    description: "Vezi statisticile tale sau ale altui user.",

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
        let bistari
        let giftPoints
        let banAndreeaTickets
        let trapTickets
        let modifyServerTickets
        let nadirTickets
        let escapeTickets
        let stfuTickets
        let speakTickets

        if (userArg == null) {
            member = interaction.user.username
            bistari = cmdAuthorDbDoc.bistari
            giftPoints = cmdAuthorDbDoc.gift_points
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
            bistari = mentionedUserDbDoc.bistari
            giftPoints = mentionedUserDbDoc.gift_points
            banAndreeaTickets = mentionedUserDbDoc.ban_andreea_tickets
            trapTickets = mentionedUserDbDoc.trap_tickets
            modifyServerTickets = mentionedUserDbDoc.modify_server_tickets
            nadirTickets = mentionedUserDbDoc.nadir_tickets
            escapeTickets = mentionedUserDbDoc.escape_nadir_tickets
            stfuTickets = mentionedUserDbDoc.taci_tickets
            speakTickets = mentionedUserDbDoc.nu_tac_tickets
        }
        const embed = new MessageEmbed()
            .setColor(utils.GenerateColor() as ColorResolvable)
            .setTitle(`${member} - Stats`)
            .setDescription(`🪙 **BI$TARI:** ${bistari}\n🎁 **Gift Points:** ${giftPoints}/${giftBoxPrice}\n\n🎟️ **Ban Andreea Tickets:** ${banAndreeaTickets}\n🎟️ **Trap Tickets:** ${trapTickets}\n🎟️ **Modify Server Tickets:** ${modifyServerTickets}\n🎟️ **Nadir Tickets:** ${nadirTickets}\n🎟️ **Escape Tickets:** ${escapeTickets}\n🎟️ **STFU Tickets:** ${stfuTickets}\n🎟️ **Speak Tickets:** ${speakTickets}`)

        interaction.reply({
            embeds: [embed]
        })

    }

} as ICommand