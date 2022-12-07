import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
// import CooldownTypes from "wokcommands"
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils"

export default {
    category: "Economy",
    description: "Incearca sa furi de la cnv da vezi poate ajungi la anchisoare (Nadir)!!!",

    slash: true,

    options: [{
        name: "user",
        description: "Pe cine vrei sa incerci sa jefuiesti.",
        type: "USER",
        required: true
    }],

    cooldown: "15m",

    callback: async ({ channel, interaction, args }) => {
        const userArg = interaction.options.getUser('user')

        if (userArg == null || interaction.member == null) {
            return
        }

        const memberArg = interaction.guild?.members.cache.get(userArg?.id.toString())

        if (memberArg == null) {
            return
        }

        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })
        const mentionedUserDbDoc = await userschema.findOne({ 'user_id': userArg.id })

        if (!mentionedUserDbDoc) {
            interaction.reply({
                content: `**Acel user nu exista in baza de date. Daca crezi ca asta e o eroare da-i 7 pinguri lui KayuZer0**`,
                ephemeral: true,
            })

            return
        }

        if (!cmdAuthorDbDoc) {
            return
        }

        let authorRoles = (interaction.member?.roles as GuildMemberRoleManager).cache;
        let mentionedMemberRoles = (memberArg?.roles as GuildMemberRoleManager).cache;

        if (mentionedMemberRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
            interaction.reply({
                content: `**Baiete nu poti sa furi de la BI$TAR**`,
                files: ['./resources/ceprost.jpg'],
                ephemeral: true,
            })

            return
        }

        if (cmdAuthorDbDoc.bistari < 200) {
            interaction.reply({
                content: `**Nu poti sa furi de la cineva daca ai mai putin de 200 BI$TARI.**`,
                ephemeral: true
            })

            return
        }

        if (mentionedUserDbDoc.bistari < 200) {
            interaction.reply({
                content: `**Nu poti sa furi de la cineva care are mai putin de 200 BI$TARI, nesimptitule.**`,
                ephemeral: true
            })

            return
        }

        const authorMemberObject = interaction.guild?.members.cache.get(interaction.user?.id.toString())
        if (authorMemberObject == undefined) {
            return
        }
        
        let authorBistari = cmdAuthorDbDoc.bistari
        let mentionedUserBistari = mentionedUserDbDoc.bistari

        let newAuthorBistari = authorBistari
        let newMentionedUserBistari = mentionedUserBistari

        var stealMessage = ""

        var rand = Math.random()
    
        if (rand <= 0.45) {
            // Fura jumate din bistari
            newAuthorBistari = Math.floor(authorBistari + ( mentionedUserBistari / 2 ))
            newMentionedUserBistari = Math.floor(mentionedUserBistari / 2)
            stealMessage = `**Ai furat ** ${Math.floor(mentionedUserBistari / 2)} **BI$TARI de la** ${memberArg}`
        } else {
            // Primesti Nadir in pula mea
            newAuthorBistari = Math.floor(authorBistari - (authorBistari / 2))
            if ((authorRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID) || interaction.user.id == utils.KAYU_ID)) {
                utils.MakeNadir(memberArg)
                stealMessage = `**Ai fost prins de Aitilop in timp ce incercai sa furi de la ${memberArg}. Acum esti Nadir. Ai pierdut** ${Math.floor(authorBistari / 2)} **BI$TARI**`
            }
            else {
                stealMessage = `**Ai fost prins de Aitilop in timp ce incercai sa furi de la ${memberArg}. Ai pierdut** ${Math.floor(authorBistari / 2)} **BI$TARI**`
            }
        }

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newAuthorBistari }
        );

        await userschema.findOneAndUpdate(
            { user_id: userArg.id },
            { bistari: newMentionedUserBistari }
        );


        interaction.reply({
            content: stealMessage
        })

    }

} as ICommand