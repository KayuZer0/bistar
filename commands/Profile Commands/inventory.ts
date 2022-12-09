import { ColorResolvable, DiscordAPIError, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";
import { client } from "../../index"
import ticketschema from "../../schemas/ticketschema";
import oreschema from "../../schemas/oreschema";
import crateschema from "../../schemas/crateschema";

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
            if (!mentionedUserDbDoc) {
                interaction.reply({
                    content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                    ephemeral: true,
                })

                return
            }

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
            dbDoc.nu_tac_tickets,
            dbDoc.coal,
            dbDoc.copper,
            dbDoc.iron,
            dbDoc.gold,
            dbDoc.diamond,
            dbDoc.emerald,
            dbDoc.basic_crates
        ]

        let vanityInventory = [
            `**${(await ticketschema.findOne({ 'id': 0 }))?.vanity_name}** x${dbDoc.ban_andreea_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 1 }))?.vanity_name}** x${dbDoc.trap_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 2 }))?.vanity_name}** x${dbDoc.modify_server_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 3 }))?.vanity_name}** x${dbDoc.nadir_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 4 }))?.vanity_name}** x${dbDoc.escape_nadir_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 5 }))?.vanity_name}** x${dbDoc.taci_tickets}`,
            `**${(await ticketschema.findOne({ 'id': 6 }))?.vanity_name}** x${dbDoc.nu_tac_tickets}`,

            `${(await oreschema.findOne({ 'id': 0 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 0 }))?.vanity_name}** x${dbDoc.coal}`,
            `${(await oreschema.findOne({ 'id': 1 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 1 }))?.vanity_name}** x${dbDoc.copper}`,
            `${(await oreschema.findOne({ 'id': 2 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 2 }))?.vanity_name}** x${dbDoc.iron}`,
            `${(await oreschema.findOne({ 'id': 3 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 3 }))?.vanity_name}** x${dbDoc.gold}`,
            `${(await oreschema.findOne({ 'id': 4 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 4 }))?.vanity_name}** x${dbDoc.diamond}`,
            `${(await oreschema.findOne({ 'id': 5 }))?.vanity_emoji} **${(await oreschema.findOne({ 'id': 5 }))?.vanity_name}** x${dbDoc.emerald}`,

            `${(await crateschema.findOne({ 'id': 0 }))?.vanity_emoji} **${(await crateschema.findOne({ 'id': 0 }))?.vanity_name}** x${dbDoc.basic_crates}`,
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