import DiscordJS, { Client, ColorResolvable, Guild, GuildMember, GuildMemberRoleManager, Intents, Message, MessageEmbed, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import mongoose from 'mongoose'
import path from 'path'
import 'dotenv/config'
import serverschema from './schemas/serverschema'
import userschema from './schemas/userschema'
import { CronJob } from 'cron'
import * as utils from "./utils"
dotenv.config()

var rainbowTimer: NodeJS.Timeout | null

const cron = require('node-cron');

export const client = new DiscordJS.Client({
  intents : [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})

client.on('guildMemberAdd', async (member) => { 
  if (!member.user.bot) {
    utils.CreateMemberSchema(member)
  }
})

client.on('ready', async () => {
  
  const guild = client.guilds.cache.get(utils.KAYU_SERVER_ID)
  guild?.members.fetch().then(members => {
  members.forEach(member => {
    if (!member.user.bot) {
        utils.CreateMemberSchema(member)
      }
    })   
  })

  client.user?.setActivity("cu bi$tarii", {
    type: "PLAYING",
  });

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    typeScript: false,
    mongoUri: process.env.MONGO_URI,
    botOwners: ['415241379866869771']
  })
    .setDefaultPrefix('-')

  StartRainbow()
  
  cron.schedule('0 * * * *', function () {
    Payday(true)
  });

})

export async function Payday(resetMessages: boolean){
  await (await userschema.find()).forEach(
    async function (doc) {
      const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
      const member = (await client.guilds.fetch(utils.KAYU_SERVER_ID)).members.fetch(doc.user_id)

      if (serverDbDoc == null) {
        return
      }

      let paydayBistari = serverDbDoc.bistari_per_message
      let paydayGiftPoints = serverDbDoc.giftpoints_per_payday
      const bistarPaydayMultiplier = serverDbDoc.bistar_payday_multiplier

      const giftBoxPrice = serverDbDoc.giftbox_price

      let memberRoles = ((await member).roles as GuildMemberRoleManager).cache;
      if (memberRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
        paydayBistari = paydayBistari * bistarPaydayMultiplier
        paydayGiftPoints = paydayGiftPoints * bistarPaydayMultiplier
      }

      const bistari = doc.bistari
      const payday = doc.messages_sent * paydayBistari

      const newBistari = bistari + payday
      await userschema.findOneAndUpdate(
        { _id: doc.id },
        { bistari: newBistari }
      );
      
      const newGiftPoints = doc.gift_points + paydayGiftPoints
      await userschema.findOneAndUpdate(
        { _id: doc.id },
        { gift_points: newGiftPoints }
      );
        
      const userId = doc.user_id
      const user = client.users.fetch(doc.user_id).then(async (user) => {
        if (user.bot) {
          return
        }

        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`🪙 Your Paycheck has arrived!`)
          .addField(`Mesaje trimise ora asta:`, `${doc.messages_sent}`, false)
          .addField(`BI$TARI Primiti:`, `${doc.messages_sent} x ${paydayBistari} = ${payday}`, false)
          .addField(`BI$TARI Totali:`, `${newBistari}`, false)
          .addField(`Ai primit 100 Gift Points:`, `${newGiftPoints}/${giftBoxPrice}`, false)
          
        let memberRoles = ((await member).roles as GuildMemberRoleManager).cache;
        if (memberRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
          embed.setFooter(`Pentru ca esti BI$TAR, ai primit x${bistarPaydayMultiplier} Payday!`)
        }

        user.send({embeds: [embed]}).catch(error => {
          console.log(`Something went wrong while I tried to send a DM to ${user}`)
        }) 
            
      });
      
      if (resetMessages) {        
        await userschema.findOneAndUpdate(
          { _id: doc.id },
          { messages_sent: 0 }
        );
      }
    }
  )
}
  
export async function RestartRainbow() {
  StopRainbow()
  setTimeout(function () {
    StartRainbow()
  }, 1000);
}

async function StartRainbow() { 
  const serverDb = await utils.GetServerDatabase()
  
  if (serverDb) {
    var databaseRainbowSpeed = serverDb.rainbow_speed
    var rainbowSpeed = databaseRainbowSpeed * 5 * 60000

    if (databaseRainbowSpeed == 0) {
      return
    }

    rainbowTimer = setTimeout(function () {
      ChangeBistarRoleColor()
      StartRainbow()
    }, rainbowSpeed);

  }

}

function StopRainbow() {
  if (rainbowTimer != null) {
    clearTimeout(rainbowTimer)
  }
}

function ChangeBistarRoleColor() {
  const guild = client.guilds.cache.get(utils.KAYU_SERVER_ID)
  const role = guild?.roles.cache.get(utils.BISTAR_ROLE_ID)

  role?.edit({
    color: utils.GenerateColor() as ColorResolvable
  })

  console.log(`Color change to ${role?.color}`)
}

client.on("messageCreate", async function (message) {
  const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
  const messageAuthorDbDoc = await userschema.findOne({ 'user_id': message.author.id })

  if (!serverDbDoc) {
    return
  }

  if (!messageAuthorDbDoc) {
    return
  }

  console.log(message.content)

  const messagesSent = messageAuthorDbDoc.messages_sent
  
  const isBistar = message.member?.roles.cache.some((role: any) => role.id === utils.BISTAR_ROLE_ID)
  const isNadir = message.member?.roles.cache.some((role: any) => role.id === utils.NADIR_ROLE_ID)

  //? Increment messages_sent in the databse
  if (messageAuthorDbDoc) {
    const newMessagesSent = messagesSent + 1
    await userschema.findOneAndUpdate(
      { user_id: message.author.id },
      { messages_sent: newMessagesSent }
    );
  }

  //? Trap logic
  if (serverDbDoc.trap_active && message.author.id != utils.KAYU_ID && !isBistar && !message.author.bot && message.channel.id != utils.NADIR_CHANNEL_ID && message.member) {
    const rand = Math.random()
    if (rand < 0.05) {
      await serverschema.findOneAndUpdate(
        { _id: utils.SERVER_DATABASE_DOCUMENT_ID },
        { trap_active: false }
      );
      utils.MakeNadir(message.member)
      message.reply(`**Fraiere era trap pe server acum esti Nadir lmao**`)
      message.author.send("**Pe server era pus un trap si tu l-ai activat. Acum esti Nadir. \nCat timp esti Nadir nu ai acces la niciun canal in afara de Nadir Box \nPentru a scapa de rolul de Nadir, poti cumpara Escape Ticket de pe /shop**")
    }
  }

  //? Punishment for talking on #nadir-box
  if (message.channel.id == utils.NADIR_CHANNEL_ID && !isNadir && !isBistar && message.author.id != utils.KAYU_ID && !message.author.bot && message.member) {
    utils.MakeNadir(message.member)
    message.reply(`**Pentru ca ai indraznit sa vorbesti cu un Nadir, acum si tu esti Nadir. Lmao ce fraer.**`)
  }

  //? Only speaking with attachments logic.
  if (message.author.id != utils.KAYU_ID && !isBistar && !message.author.bot && message.member) {
    if (messageAuthorDbDoc.taci) {      
      if (message.attachments.size < 1) {
        message.delete()
      }
    }
  }

})

client.login(process.env.TOKEN)