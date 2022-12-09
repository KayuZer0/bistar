import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import ticketschema from "../../schemas/ticketschema";
import * as utils from "../../utils";
import crateschema from "../../schemas/crateschema";

export default {
    category: "Crates",
    description: "Cumpara un crate frate",

    slash: true,

    options: [{
        name: "id",
        description: "ID la ce crate vrei sa cumperi.",
        type: "INTEGER",
        required: true
    }],

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })

        if (cmdAuthorDbDoc == null || serverDbDoc == null) {
            return
        }

        const id = interaction.options.getInteger('id')
        const crateDbDoc = await crateschema.findOne({ 'id': id })

        if (crateDbDoc == null) {
            interaction.reply({
                content: `**Ai introdus un ID Invalid. Foloseste** /crates **sau** /inventory **ca sa vezi ce crateuri exista.**`,
                ephemeral: true,
            })

            return
        }

        //
        var crateName = crateDbDoc.name
        var vanityName = crateDbDoc.vanity_name
        var vanityEmoji = crateDbDoc.vanity_emoji
        const crates = cmdAuthorDbDoc.get(crateName)

        if (crates < 1) {
            interaction.reply({
                content: `**Nu ai niciun** ${vanityEmoji} ${vanityName} **pentru a deschide. Foloseste** /crates`,
                ephemeral: true,
            })

            return
        }

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { [crates]: -1 } }
        );

        const prizePool = crateDbDoc.items_to_win
        const chances = crateDbDoc.chances
        const prize = utils.percentageChance(prizePool, chances)
        let prizeVanityName = `Nimic`
        let prizeIncrement = 1

        if (prize == 'bistari') {
            prizeIncrement = utils.GetRandomNumber(500, 2501)
            prizeVanityName = `${prizeIncrement} :dollar:`
        }

        if (prize != 'bistari' && prize != 'nothing') {
            const ticketDbDoc = await ticketschema.findOne({ 'name': prize })
            if (ticketDbDoc == null) { return; }
            prizeVanityName = ticketDbDoc.vanity_name
        }

        interaction.reply({
            content: `**Ai deschis un** ${vanityEmoji} ${vanityName} **si ai primit:** ${prizeVanityName}`,
            ephemeral: true,
        })

        if (prize != 'nothing') {
            await userschema.findOneAndUpdate(
                { user_id: interaction.member?.user.id },
                { $inc: { [prize]: prizeIncrement } }
            );
        }

        await userschema.findOneAndUpdate(
            { user_id: interaction.member?.user.id },
            { $inc: { [crateName]: -1 } }
        );

    }

} as ICommand