import mongoose, { Schema } from "mongoose";
import {  IPlayer } from "../types";

const PlayerSchema = new Schema<IPlayer>({
    guildId: { required:true, type: String },
    options: {
        autoPlay: { required: true, type: Boolean, default: false },
        loop: { required: true, type: Boolean, default: false },
        volume: { required: true, type: Number, default: 80 }
    }
})

const db = mongoose.connection.useDb(process.env.STALKER_DATABASE)
const PlayerModel = db.model("player", PlayerSchema, "players")

export default PlayerModel