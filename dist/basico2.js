"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ts_graphviz_1 = require("ts-graphviz");
var node_1 = require("@ts-graphviz/node");
var G = (0, ts_graphviz_1.digraph)("G", function (g) {
    var _a;
    var a = g.node("aa");
    var b = g.node("bb");
    var c = g.node("cc");
    g.edge([a, b, c], (_a = {},
        _a[ts_graphviz_1.attribute.color] = "red",
        _a));
    g.subgraph("A", function (A) {
        var _a, _b, _c;
        var Aa = A.node("Aaa", (_a = {},
            _a[ts_graphviz_1.attribute.color] = "pink",
            _a));
        var Ab = A.node("Abb", (_b = {},
            _b[ts_graphviz_1.attribute.color] = "violet",
            _b));
        var Ac = A.node("Acc");
        A.edge([Aa.port({ compass: "c" }), Ab, Ac, "E"], (_c = {},
            _c[ts_graphviz_1.attribute.color] = "red",
            _c));
    });
});
(0, node_1.exportToFile)(G, {
    format: "svg",
    output: path_1.default.resolve(__dirname, "../graphs/basico2-ts.svg"),
});
(0, node_1.exportToFile)(G, {
    format: "png",
    output: path_1.default.resolve(__dirname, "../graphs/basico2-ts.png"),
});
