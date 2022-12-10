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

        let member: string
        let dbDoc: any

        if (userArg == null) {
            member = interaction.user.username
            dbDoc = cmdAuthorDbDoc
        } else {
            const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg?.id })
            if (!mentionedUserDbDoc) {
                interaction.reply({
                    content: `**Acel user nu exista in baza de date. Incearca din nou si daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
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

        let vanityInventory: any[] = []

        const ticektCursor = await ticketschema.find({})
        const oreCursor = await oreschema.find({})
        const crateCursor = await crateschema.find({})

        if (ticektCursor == null || oreCursor == null || crateCursor == null) {
            interaction.reply({
                content: `**Eroare la incarcearea inventarului. Incearca din nou si daca nu merge da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }

        await interaction.deferReply()

        LoadInventory(dbDoc, vanityInventory, interaction, member)

    }

} as ICommand

async function LoadInventory(dbDoc: any, vanityInventory: any, interaction: any, member: any) {
    const ticketCursor = await ticketschema.find({})
    GetTicketInventory(ticketCursor, dbDoc, vanityInventory, interaction, member)
}

async function GetTicketInventory(ticketCursor: any, dbDoc: any, vanityInventory: any, interaction: any, member: any) {
    const max = await ticketschema.findOne().sort({ 'id': -1 }).limit(1)
    if (max == null) { return }

    ticketCursor.forEach(async function (err: any, id: any) {
        const ticketDb = await ticketschema.findOne({ 'id': id })
        if (ticketDb == null) { console.log('cox ticket'); return }

        if (dbDoc.get(ticketDb.name) > 0) {
            var vanityString = `**${ticketDb.vanity_name}** x${dbDoc.get(ticketDb.name)}\n`
            await vanityInventory.push(vanityString)
        }

        if (id == max.id) {
            GetOreInventory(dbDoc, vanityInventory, interaction, member)
        }

    })
}

async function GetOreInventory(dbDoc: any, vanityInventory: any, interaction: any, member: any) {
    const oreCursor = await oreschema.find({})

    const max = await oreschema.findOne().sort({ 'id': -1 }).limit(1)
    if (max == null) { return }

    oreCursor.forEach(async function (err: any, id: any) {
        const oreDb = await oreschema.findOne({ 'id': id })
        if (oreDb == null) { return }

        if (dbDoc.get(oreDb.name) > 0) {
            var vanityString = `${oreDb.vanity_emoji} **${oreDb.vanity_name}** x${dbDoc.get(oreDb.name)}\n`
            await vanityInventory.push(vanityString)
        }

        if (id == max.id - 0.5) {
            GetCrateInventory(dbDoc, vanityInventory, interaction, member)
        }

    })
}

async function GetCrateInventory(dbDoc: any, vanityInventory: any, interaction: any, member: any) {
    const crateCursor = await crateschema.find({})

    const max = await crateschema.findOne().sort({ 'id': -1 }).limit(1)
    if (max == null) { return }

    crateCursor.forEach(async function (err: any, id: any) {
        const crateDb = await crateschema.findOne({ 'id': id })
        if (crateDb == null) { return }

        if (dbDoc.get(crateDb.name) > 0) {
            var vanityString = `${crateDb.vanity_emoji} **${crateDb.vanity_name}** x${dbDoc.get(crateDb.name)}\n`
            await vanityInventory.push(vanityString)
        }

        if (id == max.id) {
            DisplayInventory(dbDoc, vanityInventory, interaction, member)
        }

    })
}

async function DisplayInventory(dbDoc: any, vanityInventory: any, interaction: any, member: any) {
    if (vanityInventory.length == 0) {
        vanityInventory[0] = `Acest inventar este gol.`
    }

    const embed = new MessageEmbed()
        .setColor(utils.GenerateColor() as ColorResolvable)
        .setTitle(`${member} - Inventory`)
        .setDescription(vanityInventory.toString().replaceAll(`,`, ``))

    interaction.editReply({
        embeds: [embed]
    })
}