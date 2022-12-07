import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";
import { client } from "../../index"
import ticketschema from "../../schemas/ticketschema";

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

        let member
        let dbDoc

        if (userArg == null) {
            member = interaction.user.username
            dbDoc = cmdAuthorDbDoc
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg?.id })
            if (mentionedUserDbDoc == null) { return }
            member = userArg.username
            dbDoc = mentionedUserDbDoc
        }

        let inventory = [
            dbDoc.ban_andreea_tickets,
            dbDoc.trap_tickets,
            dbDoc.modify_server_tickets,
            dbDoc.nadir_tickets,
            dbDoc.escape_nadir_tickets,
            dbDoc.taci_tickets,
            dbDoc.nu_tac_tickets
        ]

        let vanityInventory = [
            `**${(await ticketschema.findOne({ 'id': 0 }))?.vanity_name}** ${dbDoc.ban_andreea_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 1 }))?.vanity_name}** ${dbDoc.trap_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 2 }))?.vanity_name}** ${dbDoc.modify_server_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 3 }))?.vanity_name}** ${dbDoc.nadir_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 4 }))?.vanity_name}** ${dbDoc.escape_nadir_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 5 }))?.vanity_name}** ${dbDoc.taci_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 6 }))?.vanity_name}** ${dbDoc.nu_tac_tickets}`
        ]

        let finalInventory = []
        for (var i = 0; i < inventory.length; i++) {
            if (inventory[i] > 0) {
                finalInventory.push(`${vanityInventory[i]}` + `\n`)
            }
        }

        if (finalInventory.length == 0) {
            finalInventory[0] = `Acest inventar este gol.`
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