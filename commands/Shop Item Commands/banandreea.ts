import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils"

export default {
    category: "BI$TAR Shop",
    description: "Da-i ban(kick) lu' Andreea simplu si usor.",

    slash:true,

    callback: async ({ channel, interaction, args }) => {
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.member?.user.id })
        
        if (cmdAuthorDbDoc == null) {
            return
        }

        const tickets = cmdAuthorDbDoc.ban_andreea_tickets

        if (tickets < 1) {
            interaction.reply({
                content: `**Bai nebunule, ai nevoie de 'Ban Andreea Ticket' pentru asta. Vezi pe /shop saracule.**`,
                files: ['./resources/muie.jpg'],
                ephemeral: true
            })

            return
        }

        const guild = interaction.guild
        if (!guild?.members.cache.has(utils.DEEYUH_ID)) {
            interaction.reply({
                content: "**Coaie andreea nu e pe server esti coxat?**",
                files: ['./resources/ceprost.jpg'],
                ephemeral: true
            })

            return
        }
        
        // Command block
    
        const newTickets = tickets - 1
        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { ban_andreea_tickets: newTickets }
        );

        await interaction.reply({
            content: `**Gata coaie i-am dat kick lu andreea lmao**`,
            files: ['./resources/penguin0dance.gif']
        });
            
        (await guild.members.fetch(utils.DEEYUH_ID)).kick("Cineva a folosit 'Ban Andreea Ticket'")

        
    }
} as ICommand