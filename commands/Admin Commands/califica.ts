import { FetchMemberOptions, FetchMembersOptions, Guild, GuildMember, GuildMemberRoleManager, Message, MessageOptions, MessagePayload, UserResolvable } from "discord.js";
import { MessageEmbed}  from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";
import { client } from "../../index"
import * as utils from "../../utils"

export default {
    category: "BI$TAR Perk",
    description: "Califica pe cineva sa fie urmatorul BI$TAR.",
    slash: true,
    
    callback: ({ channel, interaction, guild, args }) => {
        let authorRoles = (interaction.member?.roles as GuildMemberRoleManager).cache;
        if (!authorRoles.some((role: any) => role.id === utils.BISTAR_ROLE_ID) && interaction.user.id != utils.KAYU_ID) {
            interaction.reply({
                content: `**Bai nebunule, n-ai tu voie la asa ceva**`,
                ephemeral: true,
                files: ['./resources/muie.jpg'],
            })

            return;
        }

        //Command block
            
        guild?.members.fetch().then(async members => {
    
            let memberArray: string[] = []
    
            // await new Promise((resolve) => { })
    
            members.forEach(member => {
                if (!member.user.bot && member.user.id != utils.KAYU_ID) {
                    if (member.roles.cache.some((role: any) => role.id === utils.BISTAR_ROLE_ID)) {
                        member.roles.remove(utils.BISTAR_ROLE_ID)
                    }

                    memberArray.push(member.user.id.toString())
                }
            }) 
            
            interaction.reply({
                content: `**Ia sa vedem frate pe cine calificam**`,
                files: ['./resources/ochelari.jpg']
            })
    
            setTimeout(function () {                
                var selectedUserID = memberArray[Math.floor(Math.random() * memberArray.length)]
                var selectedMember = guild.members.cache.get(selectedUserID)
                var role = guild.roles.cache.find((role) => role.id === utils.BISTAR_ROLE_ID)
                if (role != undefined) {
                    selectedMember?.roles.add(role)
                }
                channel.send(`**Mama coaie ${selectedMember} a primit rolul de ${role} si acum e foarte calificat**`)
            }, 2000);
        })
    }


} as ICommand