import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import * as utils from "../../utils"
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import { client } from "../../index"

export default {
    category: "BI$TAR Shop",
    description: "Seteaza numele la server.",
    slash: true,

    options: [{
        name: "name",
        description: "Numele pe care vrei sa-l pui la server.",
        type: "STRING",
        required: true
    }],

    callback: async ({ channel, interaction, guild, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.modify_server_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Modify Server Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        const nameArg = interaction.options.getString('name')

        if (nameArg == null) {
            return
        }

        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { modify_server_tickets: newTickets }
        );

        const KAYU_GUILD = await client.guilds.cache.get(utils.KAYU_SERVER_ID)
        KAYU_GUILD?.setName(nameArg)

        interaction.reply({
            content: `**Gata coaie asa facem am schimbat numele serverului in '${nameArg}'**`
        })

    }
} as ICommand