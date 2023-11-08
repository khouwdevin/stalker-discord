import { MoonlinkPlayer } from "moonlink.js";
import { MoonEvent } from "../types";
import { EmbedBuilder } from "@discordjs/builders";

const event: MoonEvent = {
    name: "trackStart",
    execute: (player: MoonlinkPlayer, track: any) => {
        const embed  = new EmbedBuilder()
            .setAuthor({ name: `Now playing ${track.title}` })

    }
}

export default event;