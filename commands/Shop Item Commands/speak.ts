import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Nu mai trebuie sa vorbesti doar prin attachments.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.nu_tac_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Speak Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        if (!cmdAuthorDbDoc.taci) {
            interaction.reply({
                content: `**Varule deja nu trebuie sa taci.**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { nu_tac_tickets: newTickets }
        );

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { taci: false }
        );

        interaction.reply({
            content: `**Gata frate spre deosebire de Andreea tu acum ai dreptul la expirmare libera.**`,
            files: ['./resources/speak.gif']
        })

    }
} as ICommand