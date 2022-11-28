import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import * as utils from "../../utils";

export default {
  category: "Economy",
  description: "Vezi ce poti sa mperi",

  slash: true,

  callback: async ({ channel, interaction, args }) => {
    const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
    const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

    if (serverDbDoc == null || cmdAuthorDbDoc == null) {
      return
    }

    const bistari = cmdAuthorDbDoc.bistari

    const embed = new MessageEmbed()
      .setColor(utils.GenerateColor() as ColorResolvable)
      .setTitle(`Păcănele [-] Foloseste /slots <bet> [-] Momentan ai ${bistari} BI$TARI`)
      .setDescription(`**Win conditions:**\n\n| ${serverDbDoc.slots_roll_emoji} | ${serverDbDoc.slots_roll_emoji} | ❓ | 🢂 **x1.5**\n\n| 🍀 | 🍀 | 🍀 | 🢂 **x1 + Ban lu' Andreea**\n\n| 🍒 | 🍒 | 🍒 | 🢂 **x2**\n\n| 🍇 | 🍇 | 🍇 | 🢂 **+7**\n\n| ${serverDbDoc.slots_jackpot_emoji} | ${serverDbDoc.slots_jackpot_emoji} | ${serverDbDoc.slots_jackpot_emoji} | 🢂 **x10**`)

    interaction.reply({
      embeds: [embed]
    })
  }

} as ICommand