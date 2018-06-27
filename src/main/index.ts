import {script} from "../../config/main/script";
import {SessionManager} from "./session/SessionManager";

console.log(`${JSON.stringify(new SessionManager(script))}`);
