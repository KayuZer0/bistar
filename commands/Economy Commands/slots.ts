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

    const newBistari = bistari - bet
    await userschema.findOneAndUpdate(
      { user_id: interaction.member?.user.id },
      { bistari: newBistari }
    );

    //? 🍉 - x0.5
    //? 🍀 - ban lu andreea
    //? 🍒 - x2
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
        if ($ == "🍉") {
          const newBistari = Math.ceil(bistari + (bet * 0.5))
          $4.setFooter(`Ai castigat: ${bet - (bet * 0.5)} BI$TARI!\nAcum ai: ${newBistari}`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
        } else if ($ == "🍇") {
          const newBistari = bistari + bet + 7
          $4.setFooter(`Ai castigat: 7 BI$TARI!\nAcum ai: ${newBistari}`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
        } else if ($ == "🍒") {
          const newBistari = bistari + bet + (bet * 2)
          $4.setFooter(`Ai castigat: ${bet - (bet * 2)} BI$TARI!\nAcum ai: ${newBistari}`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
        } else if ($ == "🍋") {
          const newBistari = bistari + bet + (bet * 5)
          $4.setFooter(`Ai castigat: ${bet - (bet * 5)} BI$TARI!\nAcum ai: ${newBistari}`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
        } else if ($ == serverDbDoc.slots_jackpot_emoji) {
          const newBistari = bistari + bet + (bet * 10)
          $4.setFooter(`Ai castigat: ${bet * 10} BI$TARI!\nAcum ai: ${newBistari}`)
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
        } else if ($ == "🍀") {
          $4.setFooter(`Andreea a luat ban! Ai primit: ${bet} BI$TARI inapoi.`)
          const newBistari = bistari + bet
          await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { bistari: newBistari }
          );
          client.guilds.cache.get(utils.KAYU_SERVER_ID)?.members.cache.get(utils.DEEYUH_ID)?.kick("🢂 🍀 🍀 🍀 🢀").catch(async (error) => {
            $4.setFooter(`Eroare la Ban Andreea! Ai primit: ${bet} BI$TARI inapoi.`)
          });
        }


      } else if ($ == $$ || $$ == $$$) {
        $4.setFooter(`Ai castigat ${bet * 1.5} BI$TARI`)
        const newBistari = bistari + (bet * 1.5)
        await userschema.findOneAndUpdate(
          { user_id: interaction.member?.user.id },
          { bistari: newBistari }
        );
      } else {
        $4.setFooter(`Ai pierdut ${bet} BI$TARI`)
      }

      await interaction.editReply({
        embeds: [$4]
      })

    }, 2400);

  }

} as ICommand