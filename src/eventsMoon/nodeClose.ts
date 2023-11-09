import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeClose",
    execute: (node: MoonlinkNode) => {
        console.log(
            color("text", `❌ ${color("variable", node.host)} was disconnected!`)
        )
    }
}

export default event;