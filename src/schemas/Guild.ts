import { Schema, model } from "mongoose";
import { IGuild } from "../types";

const GuildSchema = new Schema<IGuild>({
    guildID: {required:true, type: String},
    options: {
        detectvoice: {type: Boolean, default: false},
        notify: {type: Boolean, default: false}
    }
})

const GuildModel = model("guild", GuildSchema)

export default GuildModel