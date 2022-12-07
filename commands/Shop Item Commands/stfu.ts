import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import serverschema from "../../schemas/serverschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Fa pe cineva sa poata vorbi doar cu attachments.",

    slash: true,

    options: [{
        name: "user",
        description: "Useru pe care vrei sa-l faci sa taca.",
        type: "USER",
        required: true
    }],

    callback: async ({ channel, interaction, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.taci_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'STFU Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        const userArg = interaction.options.getUser("user")
        if (!userArg) {
            return
        }

        const mentionedMemberDbDoc = await userschema.findOne({ 'user_id': userArg.id })

        if (!mentionedMemberDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }

        if (userArg?.id == utils.KAYU_ID) {
            interaction.reply({
                content: `**Stii ca gen chiar daca il faci pe Edi sa taca tot poate sa vorbeasca ca e sv lui facut de el, nu?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        if (userArg?.bot) {
            interaction.reply({
                content: `**Coaie cum pula mea faci tu botu sa taca?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const memberArg = interaction.guild?.members.cache.get(userArg?.id.toString())

        let memberRoles = (memberArg?.roles as GuildMemberRoleManager).cache;
        if (memberRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Coaie nu poti sa faci BI$TAR sa taca esti nebun la taraot?**`,
                ephemeral: true,
                files: ['./resources/ceprost.jpg'],
            })

            return;
        }

        if (mentionedMemberDbDoc.taci) {
            interaction.reply({
                content: `**Varule omu ala deja nu poate sa vorbeasca. Ce vrei? Sa taca de 2 ori?**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }

        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { taci_tickets: newTickets }
        );

        await userschema.findOneAndUpdate(
            { user_id: userArg.id },
            { taci: true }
        );

        interaction.reply({
            content: `**Gata frate de acum ${memberArg} poate sa vorbeasca doar cu attachments lmao.**`,
            files: ['./resources/bro-stfu.gif'],
        })

    }
} as ICommand