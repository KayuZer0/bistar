import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import * as utils from "../../utils";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import { client } from "../../index"

export default {
  category: "Economy",
  description: "Juaca la niste păcănele corecte (/slotsinfo)",

  slash: true,
  cooldown: '10s',

  options: [{
    name: "bet",
    description: "Cat vrei sa pariezi la pacanele.",
    type: "INTEGER",
    required: true
  }],

  callback: async ({ channel, interaction, args }) => {
    const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
    const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

    if (cmdAuthorDbDoc == null || serverDbDoc == null) {
      return
    }

    const bet = interaction.options.getInteger('bet')
    var bistari = cmdAuthorDbDoc.bistari
    if (bet == null) return

    if (bet < 1) {
      await interaction.reply({
        content: `**Coaie lasa legalele, cum vrei sa pariezi mai putin de 1 BI$TARI?.**`,
        files: ['./resources/ceprost.jpg'],
        ephemeral: true
      });

      return
    }

    if (cmdAuthorDbDoc.bistari < bet) {
      interaction.reply({
        content: `**Sarakule nu ai destui BI$TARI. La munca nu la aparate.**`,
        files: ['./resources/muie.jpg'],
        ephemeral: true,
      })

      return
    }

    //? 🍀 - ban lu andreea
    //? 🍉 - x2
    //? 🍒 - x3
    //? 🍇 - x5
    //? :bIan: - x 10

    const symbols = ["🍉", "🍒", "🍇", "🍀", serverDbDoc.slots_jackpot_emoji]
    // const symbols = ["🍀", "🍀", "🍀", "🍀", "🍀"]

    const spins = 2;

    const slotemoji = serverDbDoc.slots_roll_emoji

    let $ = symbols[utils.GetRandomNumber(0, 5)]
    let $$ = symbols[utils.GetRandomNumber(0, 5)]
    let $$$ = symbols[utils.GetRandomNumber(0, 5)]

    const play = new MessageEmbed()
      .setTitle(`Păcănele - Bet: ${bet}`)
      .setDescription("🢂 | " + slotemoji + " | " + slotemoji + " | " + slotemoji + " | 🢀")
      .setColor('RANDOM')

    const $1 = new MessageEmbed()
      .setTitle(`Păcănele - Bet: ${bet}`)
      .setDescription("🢂 | " + $ + " | " + slotemoji + " | " + slotemoji + " | 🢀")
      .setColor('RANDOM')

    const $2 = new MessageEmbed()
      .setTitle(`Păcănele - Bet: ${bet}`)
      .setDescription("🢂 | " + $ + " | " + $$ + " | " + slotemoji + " | 🢀")
      .setColor('RANDOM')


    const $3 = new MessageEmbed()
      .setTitle(`Păcănele - Bet: ${bet}`)
      .setDescription("🢂 | " + $ + " | " + $$ + " | " + $$$ + " | 🢀")
      .setColor('RANDOM')

    await interaction.reply({
      embeds: [play]
    })

    setTimeout(async () => {
      await interaction.editReply({
        embeds: [$1]
      })
    }, 600);
    setTimeout(async () => {
      await interaction.editReply({
        embeds: [$2]
      })
    }, 1200);
    setTimeout(async () => {
      await interaction.editReply({
        embeds: [$3]
      })
    }, 1800);

    setTimeout(async () => {
      var $4 = new MessageEmbed()
        .setTitle(`Păcănele - Bet: ${bet}`)
        .setDescription("🢂 | " + $ + " | " + $$ + " | " + $$$ + " | 🢀")
        .setColor('RANDOM')

      if ($ == $$ && $$ == $$$) {
        if ($ == "🍇") {
          const win = (bet + 7) - bet
          $4.setFooter(`Ai castigat: 7 BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: win } }
          );
        } else if ($ == "🍉") {
          const win = (bet * 2) - bet
          $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: win } }
          );
        } else if ($ == "🍒") {
          const win = (bet * 3) - bet
          $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: win } }
          );
        } else if ($ == "🍋") {
          const win = (bet * 5) - bet
          $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: win } }
          );
        } else if ($ == serverDbDoc.slots_jackpot_emoji) {
          const win = (bet * 10) - bet
          $4.setFooter(`Ai castigat: ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { bistari: win } }
          );
        } else if ($ == "🍀") {
          $4.setFooter(`Andreea a luat ban si nu ai castigat nimic. Acum ai: ${bistari} BI$TARI.`)
          client.guilds.cache.get(utils.KAYU_SERVER_ID)?.members.cache.get(utils.DEEYUH_ID)?.kick("🢂 🍀 🍀 🍀 🢀").catch(async (error) => {
            $4.setFooter(`Eroare la Ban Andreea! Ai primit: ${bet} BI$TARI inapoi.`)
          });
        }
      } else if ($ == $$ || $$ == $$$) {
        const win = (bet * 1.5) - bet
        $4.setFooter(`Ai castigat ${win} BI$TARI!\nAcum ai: ${bistari + win} BI$TARI.`)
        await userschema.findOneAndUpdate(
          { user_id: interaction.member?.user.id },
          { $inc: { bistari: win } }
        );
      } else {
        $4.setFooter(`Ai pierdut ${bet} BI$TARI\nAcum ai: ${bistari - bet} BI$TARI.`)
        await userschema.findOneAndUpdate(
          { user_id: interaction.member?.user.id },
          { $inc: { bistari: -bet } }
        );
      }

      await interaction.editReply({
        embeds: [$4]
      })

    }, 2400);

  }

} as ICommand