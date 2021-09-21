"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ts_graphviz_1 = require("ts-graphviz");
var node_1 = require("@ts-graphviz/node");
var g = (0, ts_graphviz_1.digraph)('G');
var subgraphA = g.createSubgraph('A');
var nodeA1 = subgraphA.createNode('A_node1');
var nodeA2 = subgraphA.createNode('A_node2');
subgraphA.createEdge([nodeA1, nodeA2]);
var subgraphB = g.createSubgraph('B');
var nodeB1 = subgraphB.createNode('B_node1');
var nodeB2 = subgraphB.createNode('B_node2');
subgraphA.createEdge([nodeB1, nodeB2]);
var node1 = g.createNode('node1');
var node2 = g.createNode('node2');
g.createEdge([node1, node2]);
var dot = (0, ts_graphviz_1.toDot)(g);
//console.log(dot);
(0, node_1.exportToFile)(dot, {
    format: "png",
    //output: path.resolve(__dirname, "./graphs/basico-ts.png"),
    // Sobre ./dist
    output: path_1.default.resolve(__dirname, "../graphs/basico-ts.png"),
});
