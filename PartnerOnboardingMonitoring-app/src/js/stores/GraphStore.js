import { EventEmitter } from "events";
import React from 'react';

import dispatcher from "../dispatcher";

class GraphStore extends EventEmitter {
  constructor() {
    super()
    this.graph = "Graph updating";
  }

  handleActions(action) {
    switch(action.type) {
      case "REFRESH_GRAPH": {
        this.graph = action.graph;
        this.emit("change");
        break;
      }
    }
  }

  // getAll() {
  //   return this.logs;
  // }
}

const graphStore = new GraphStore;
dispatcher.register(graphStore.handleActions.bind(graphStore));

export default graphStore;
