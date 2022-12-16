import DiscordJS, { Guild, GuildMember, Intents, Message, TextChannel } from "discord.js"
import dotenv from "dotenv"
import WOKCommands from "wokcommands"
import mongoose from "mongoose"
import path from "path"
import "dotenv/config"
import serverschema from "./schemas/serverschema"
import userschema from "./schemas/userschema"
import { client } from "./index"
import ticketschema from "./schemas/ticketschema"

export const KAYU_ID = "415241379866869771"
export const DEEYUH_ID = "766336439629643797"
export const KAYU_SERVER_ID = "688349036763414638"
export const BISTAR_ROLE_ID = "688351370260119567"
export const NADIR_ROLE_ID = "960250572294979655"
export const SERVER_DATABASE_DOCUMENT_ID = "6370c636850e11bea3ac9417"
export const NADIR_CHANNEL_ID = "1043834690387320872"

export async function NadirChannel() {
    const KAYU_GUILD = await client.guilds.cache.get(KAYU_SERVER_ID)
    const NADIR_CHANNEL = KAYU_GUILD?.channels.cache.get(NADIR_CHANNEL_ID)
    return NADIR_CHANNEL
}

export async function GetServerDatabase() {
    const SERVER_DATABASE = await serverschema.findById(SERVER_DATABASE_DOCUMENT_ID)
    return SERVER_DATABASE
}

export async function MakeNadir(member: GuildMember) {
    const KAYU_GUILD = await client.guilds.cache.get(KAYU_SERVER_ID)

    var userRoles = (await KAYU_GUILD?.members.fetch(member.user))?.roles.cache.map(role => role.id)
    userRoles?.pop()

    await userschema.findOneAndUpdate(
        { user_id: member.user.id },
        { roles_cache: userRoles }
    );

    member?.roles.set([NADIR_ROLE_ID])
}

export async function RemoveNadir(member: GuildMember) { 
    const memberDbDoc = await userschema.findOne({ 'user_id': member.user.id })

    if (memberDbDoc == null) {
        return
    }

    member?.roles.set(memberDbDoc.roles_cache)

    await userschema.findOneAndUpdate(
        { user_id: member.user.id },
        { roles_cache: [] }
    );
}

export async function CreateMemberSchema(member: GuildMember) {
    const user = await userschema
        .findOne({ user_id: member.id })
        .select("user_id")
        .lean()

    if (!user && !member.user.bot) {
        new userschema({
            user_id: member.id,
            bistari: 0,
            premium_points: 0,
            level: 1,
            respect_points: 0,
            respect_points_to_next_level: 10,
            job: 0,
            miner_skill: 1,
            miner_worked: 0,
            miner_worked_to_next_skill: 10,
            coal: 0,
            copper: 0,
            iron: 0,
            gold: 0,
            diamond: 0,
            emerald: 0,
            ban_andreea_tickets: 0,
            modify_server_tickets: 0,
            taci_tickets: 0,
            nu_tac_tickets: 0,
            basic_crates: 0,
            taci: false,
            messages_sent: 0,

        }).save()
    }
}

export function GetRandomNumber(min: number, max: number) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}

export function GenerateColor() {
    const h = Math.floor(Math.random() * 255)
    const s = 100
    var l = 50

    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function percentageChance(values: any, chances: any) {
    for (var i = 0, pool = []; i < chances.length; i++) {
        for (var i2 = 0; i2 < chances[i]; i2++) {
            pool.push(i);
        }
    }
    return values[arrayShuffle(pool)['0']];
};

function arrayShuffle(array: any[]) {
    for (var i = 0, length = array.length, swap = 0, temp = ''; i < length; i++) {
        swap = Math.floor(Math.random() * (i + 1));
        temp = array[swap];
        array[swap] = array[i];
        array[i] = temp;
    }
    return array;
};

