import { Schema, model } from "mongoose";
import { IGuild } from "../types";

const GuildSchema = new Schema<IGuild>({
    guildID: {required:true, type: String},
    options: {
        prefix: {type: String, default: process.env.PREFIX},
        detectvoice: {type: Boolean, default: true}
    }
})

const GuildModel = model("guild", GuildSchema)

export default GuildModel