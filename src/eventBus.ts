import type { EventBus } from "../index";

import { EventEmitter } from "events";

const eventBus: EventBus = new EventEmitter();
eventBus.setMaxListeners(1);
export default eventBus;
