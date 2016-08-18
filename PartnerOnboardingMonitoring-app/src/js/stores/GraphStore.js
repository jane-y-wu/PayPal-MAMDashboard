import { EventEmitter } from "events";
import React from 'react';

import dispatcher from "../dispatcher";

class GraphStore extends EventEmitter {
  constructor() {
    super()
    this.data = "Graph updating";
  }

  handleActions(action) {
    switch(action.type) {
      case "REFRESH_GRAPH": {
        this.data = action.data;
        this.emit("change");
        break;
      }
    }
  }

  returnCount() {
    return this.data;
  }
}

const graphStore = new GraphStore;
dispatcher.register(graphStore.handleActions.bind(graphStore));

export default graphStore;
