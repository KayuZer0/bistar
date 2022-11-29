import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import * as index from "../../index"

export default {
    category: "Admin",
    description: "Acorda payday acum",

    slash: true,
    ownerOnly: true,

    callback: async ({ channel, interaction, args }) => {

        index.Payday(false)

        interaction.reply({
            content: `**Bai @everbody smecherosul de KayuZer0 a dat payday la toata lumea gg in chat.**`,
        })

    }

} as ICommand