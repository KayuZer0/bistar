import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload, Role } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Fa ce cineva nadir simplu si usor.",

    slash: true,

    options: [{
        name: "user",
        description: "The user you want to make a Nadir.",
        type: "USER",
        required: true
    }],

    callback: async ({ interaction }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })

        if (cmdAuthorDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.nadir_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Nadir Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        const userArg = interaction.options.getUser("user")
        if (!userArg) {
            return
        }

        if (userArg?.id == utils.KAYU_ID) {
            interaction.reply({
                content: `**Stii ca gen chiar daca ii dai Nadir lu' Edi tot are acces la toate alea ca e sv lui facut de el, nu?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        if (userArg?.bot) {
            interaction.reply({
                content: `**Coaie cum pula mea dai Nadir la bot?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const memberArg = interaction.guild?.members.cache.get(userArg?.id.toString())

        let memberRoles = (memberArg?.roles as GuildMemberRoleManager).cache;
        if (memberRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Coaie nu poti sa dai Nadir la BI$TAR esti nebun la taraot?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            })

            return;
        }

        if (memberRoles.some((role: any) => role.id === utils.NADIR_ROLE_ID)) {
            interaction.reply({
                content: `**Varule cum dai tu Nadir la Nadir?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            })

            return;
        }
        
        
        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { nadir_tickets: newTickets }
        );

        if (memberArg) {
            utils.MakeNadir(memberArg)
        }

        interaction.reply({
            content: `**Gata coaie ${memberArg} a fost promovat la functia de sclav.**`,
            files: ['./resources/nadir.gif'],
        })

    }
} as ICommand