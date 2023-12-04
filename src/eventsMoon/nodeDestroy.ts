import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeDestroy",
    execute: (node: MoonlinkNode) => {
        console.log(
            color("text", `❌ Node ${color("variable", node.host)} is destroyed!`)
        )
    }
}

export default event;