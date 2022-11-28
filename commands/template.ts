import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed}  from 'discord.js'
import { ICommand } from "wokcommands";
import mongoose from "mongoose";

export default {
    category: "Help",
    description: "Vezi comensile boss",
    
    slash: true,

    callback: async ({ channel, interaction, args }) => {
        
    }

} as ICommand