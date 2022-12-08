import { Guild, GuildMemberRoleManager, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import * as utils from "../../utils"
import serverschema from "../../schemas/serverschema";
import * as index from "../../index"

export default {
    category: "BI$TAR Perk",
    description: "Seteaza viteza la rainbow.",
    slash: true,

    options: [{
        name: "speed",
        description: "Rainbow speed.",
        type: "INTEGER",
        required: true
    }],

    callback: async ({ channel, interaction, guild, args }) => {
        let authorRoles = (interaction.member?.roles as GuildMemberRoleManager).cache;
        if (!authorRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID) && interaction.user.id != utils.KAYU_ID) {
            interaction.reply({
                content: `**Bai nebunule, n-ai tu voie la asa ceva**`,
                ephemeral: true,
                files: ['./resources/muie.jpg'],
            })

            return;
        }

        const speedArg = interaction.options.getInteger("speed")

        if (speedArg != null) {

            if (speedArg < 0 || speedArg > 5) {
                interaction.reply({
                    content: `**Rainbow Speed tre' sa fie intre 0 si 5 (Viteza = Speed * 5 Minute)**`,
                    ephemeral: true,
                    files: ['./resources/ceprost.jpg'],
                })

                return;
            }

            await serverschema.findOneAndUpdate(
                { _id: utils.SERVER_DATABASE_DOCUMENT_ID },
                { rainbow_speed: speedArg }
            )

            
            index.RestartRainbow()

            interaction.reply({
                content: `**Gata coaie asa facem**`,
            })

        }

    }
} as ICommand