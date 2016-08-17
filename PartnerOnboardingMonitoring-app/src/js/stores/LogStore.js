import { EventEmitter } from "events";
import React from 'react';

import dispatcher from "../dispatcher";

class LogStore extends EventEmitter {
  constructor() {
    super()
    this.logs = "Logs loading";
  }

  handleActions(action) {
    switch(action.type) {
      case "UPDATE_LOGS": {
        this.logs = action.logs;
        this.emit("change");
        break;
      }
    }
  }

  getAll() {
    return this.logs;
  }
}

const logStore = new LogStore;
dispatcher.register(logStore.handleActions.bind(logStore));

export default logStore;
