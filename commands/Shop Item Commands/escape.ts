import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Escape from being a Nadir.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })

        if (cmdAuthorDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.escape_nadir_tickets

        if (!interaction.member?.user) {
            return
        }

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Escape Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        let memberRoles = (interaction.member?.roles as GuildMemberRoleManager).cache;
        if (!memberRoles.some((role: any) => role.id === utils.NADIR_ROLE_ID)) {
            interaction.reply({
                content: `**De unde pula mea vrei sa dai escape daca nu esti Nadir? Cox?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            })

            return;
        }

        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { escape_nadir_tickets: newTickets }
        );

        const memberArg = interaction.guild?.members.cache.get(interaction.member?.user.id.toString())
        if (memberArg) {
            utils.RemoveNadir(memberArg)
        }

        interaction.reply({
            content: `**Felicitari spre deosebire de Andreea tu acum ai drepturi.**`,
            files: ['./resources/penguin0dance.gif'],
        })
        
    }
} as ICommand