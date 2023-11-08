import { MoonlinkNode } from "moonlink.js";
import { MoonEvent } from "../types";
import { color } from "../functions";

const event: MoonEvent = {
    name: "nodeCreate",
    execute: (node: MoonlinkNode) => {
        console.log(
            color("text", `💪 ${color("variable", node.host)} was connected!`)
        )
    }
}

export default event;