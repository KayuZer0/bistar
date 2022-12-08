import { Guild, Message, MessageOptions, MessagePayload } from "discord.js";
import { MessageEmbed}  from 'discord.js'
import { ICommand } from "wokcommands";
import * as utils from "../utils";
import mongoose from "mongoose";
// import serverschema from "../../schemas/serverschema";
// import userschema from "../../schemas/userschema";

export default {
    category: "Help",
    description: "Vezi comensile boss",
    
    slash: true,

    callback: async ({ channel, interaction, args }) => {

    }

} as ICommand