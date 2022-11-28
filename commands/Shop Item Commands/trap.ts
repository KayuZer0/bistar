import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Pune un trap pe server.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.trap_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Trap Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        if (serverDbDoc.trap_active) {
            interaction.reply({
                content: `**Stai frate ca deja e trap pus unde mai vi si tu?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { trap_tickets: newTickets }
        );

        await serverschema.findOneAndUpdate(
            { _id: utils.SERVER_DATABASE_DOCUMENT_ID },
            { trap_active: true }
        );

        interaction.reply({
            content: `**Trapul diabolic a fost setat cu succes. Sa nu zici la nimeni.**`,
            ephemeral: true
        })
        
    }
} as ICommand