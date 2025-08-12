import { Server } from "http";
import app from "./app";
import config from "./app/config";
const PORT = 5001;

async function main() {
    try {
        const server: Server = app.listen(config.port, () => {
            console.log(
                "[LOG <server.ts>]: App is listening to port ",
                config.port
            );
        });
    } catch (error) {
        console.log("[LOG <server.ts>]: Failed to run server.\n", error);
    }
}

main();
