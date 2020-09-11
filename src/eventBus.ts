import { EventEmitter } from "events";
import { EventBus } from "../index";

const eventBus: EventBus = new EventEmitter();
eventBus.setMaxListeners(1);
export default eventBus;
