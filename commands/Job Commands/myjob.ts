import { ColorResolvable, Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed } from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../../utils";
import mongoose from "mongoose";
import serverschema from "../../schemas/serverschema";
import userschema from "../../schemas/userschema";
import jobschema from "../../schemas/jobschema";
import minerschema from "../../schemas/minerschema";
import oreschema from "../../schemas/oreschema";

export default {
    category: "Jobs",
    description: "Vezi informatiile jobului tau.",

    slash: true,

    callback: async ({ channel, interaction, args }) => {
        const serverDbDoc = await serverschema.findOne({ '_id': utils.SERVER_DATABASE_DOCUMENT_ID })
        const cmdAuthorDbDoc = await userschema.findOne({ 'user_id': interaction.user.id })
        if (serverDbDoc == null || cmdAuthorDbDoc == null) { return }

        const job = cmdAuthorDbDoc.job

        if (job == 0) {
            interaction.reply({
                content: `**Momentan esti** ${(await jobschema.findOne({ 'job_id': 0 }))?.vanity_name}. **Foloseste** /jobs`
            })
        }

        if (job == 1) {
            const jobsDbDoc = await jobschema.findOne({ 'job_id': 1 })
            const minerDbDoc = await minerschema.findOne({ 'skill': cmdAuthorDbDoc.miner_skill })
            if (jobsDbDoc == null || minerDbDoc == null) { return }

            let chances = [minerDbDoc.coal_chance, minerDbDoc.copper_chance, minerDbDoc.iron_chance, minerDbDoc.gold_chance, minerDbDoc.diamond_chance, minerDbDoc.emerald_chance, minerDbDoc.pp_chance]

            let workedForNextSkill = `Max`
            let skillUpgradePrice = ``
            if (cmdAuthorDbDoc.miner_skill < 6) {
                const workedForNextSkillQuery = 'worked_for_skill_' + (cmdAuthorDbDoc.miner_skill + 1).toString()
                workedForNextSkill = jobsDbDoc?.get(workedForNextSkillQuery)
                skillUpgradePrice = `🏷️ **Pret Skill Upgrade:** ${cmdAuthorDbDoc.miner_skill * jobsDbDoc.base_price_per_skill} ${serverDbDoc.bistar_emoji}\n`
            }

            const embed = new MessageEmbed()
                .setColor(utils.GenerateColor() as ColorResolvable)
                .setTitle(`Jobul tau este:  ${jobsDbDoc?.vanity_emoji} ${jobsDbDoc?.vanity_name}`)
                .setDescription(`:muscle: **Skill:** ${cmdAuthorDbDoc.miner_skill} (Ture: ${cmdAuthorDbDoc.miner_worked}/${workedForNextSkill})\n${skillUpgradePrice}🎒 **Minereuri pe tura:** ${minerDbDoc.max_ores}\n\n**La Jobul de miner poti sa minezi urmatoarele:**
                **${(await oreschema.findOne({ 'id': 0 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 0 }))?.vanity_name}** - **Chance:** ${chances[0]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 0 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 1 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 1 }))?.vanity_name}** - **Chance:** ${chances[1]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 1 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 2 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 2 }))?.vanity_name}** - **Chance:** ${chances[2]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 2 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 3 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 3 }))?.vanity_name}** - **Chance:** ${chances[3]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 3 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 4 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 4 }))?.vanity_name}** - **Chance:** ${chances[4]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 4 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 5 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 5 }))?.vanity_name}** - **Chance:** ${chances[5]}**%** - **Sells for:** ${(await oreschema.findOne({ 'id': 5 }))?.sell_price} ${serverDbDoc.bistar_emoji}
                **${(await oreschema.findOne({ 'id': 5.5 }))?.vanity_emoji} ${(await oreschema.findOne({ 'id': 5.5 }))?.vanity_name}** - **Chance:** ${chances[6]}**%**\n
                **Foloseste comanda** /mine **pentru a mina**
                **Foloseste comanda** /sellore **pentru a vinde minereurile**
                **Foloseste comanda** /skillupgrade **pentru a-ti upgrada skillul**
                `)

            interaction.reply({
                embeds: [embed]
            })
        }
    }

} as ICommand