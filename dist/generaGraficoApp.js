"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ts_graphviz_1 = require("ts-graphviz");
var node_1 = require("@ts-graphviz/node");
var fs_1 = __importDefault(require("fs"));
var componentes_1 = require("./componentes");
var modo = "dependencia";
var subDalRank = "source";
var subContRank = "sink";
var edgeDir = "forward";
var rankDir = "TB";
process.argv.forEach(function (arg) {
    var matches;
    if (matches = arg.match(/mode=(\w+)/)) {
        modo = matches[1];
        switch (modo) {
            case "funcionalidad":
                subDalRank = "sink";
                subContRank = "source";
                edgeDir = "back";
                break;
            case "modulo":
                //rankDir = "LR"
                break;
            default:
        }
    }
});
var servicios = componentes_1.componentes;
var archivo = fs_1.default.readFileSync('../base-nest/spec/support/listTests.txt', 'utf-8');
var specs = archivo.split('\n').map(function (spec) { var _a; return ((_a = spec.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.spec.ts', '').replace('.', '').toLowerCase()) || 'Jarjar'; });
var g = (0, ts_graphviz_1.digraph)('G', {
    rankdir: rankDir
    /*
    center: true,
    margin: 1
    */
});
if (modo !== "modulo") {
    var subDals = g.createSubgraph('clusterA', {
        rank: subDalRank,
        style: "rounded",
        bgcolor: "aqua:white", // "aqua:red"
    });
    var subServices = g.createSubgraph('B', { rank: "" });
    var subControllers = g.createSubgraph('c', { rank: subContRank });
    for (var i in componentes_1.componentes) {
        if (/Module$/.test(i))
            continue;
        var shape = "ellipse";
        var color = "red";
        if (specs.includes(i.toLowerCase() || ''))
            color = "green";
        if (/(Connection|Entity|Dal)$/.test(i)) {
            shape = "cylinder";
            subDals.createNode(i);
        }
        else if (/Controller$/.test(i)) {
            shape = "trapezium";
            subControllers.createNode(i);
        }
        else if (/Service$/.test(i)) {
            subServices.createNode(i);
        }
        g.createNode(i, {
            shape: shape,
            color: color,
            //fontcolor: color,
            //fillcolor: color, 
            //style: "striped"
        });
    }
    // Guarda los edges para corregir los edges dobles
    var rels = {};
    for (var i in servicios) {
        if (/Module$/.test(i))
            continue;
        var deps = servicios[i];
        for (var x in deps) {
            var edgePoints = [deps[x], i];
            if (modo == "funcionalidad")
                edgePoints = [i, deps[x]];
            // Ajuste edge doble en rojo de dependencia
            if (rels[i + '-' + deps[x]]) {
                g.removeEdge(rels[i + '-' + deps[x]]);
                delete rels[i + '-' + deps[x]];
                rels[deps[x] + '-' + i] = g.createEdge(edgePoints, { dir: "both", color: "red" });
            }
            else
                rels[deps[x] + '-' + i] = g.createEdge(edgePoints, { dir: edgeDir });
        }
    }
}
else {
    for (var i in servicios) {
        if (!/Module$/.test(i))
            continue;
        color = specs.includes(i.toLowerCase()) ? "green" : "red";
        g.createNode(i, { color: color });
        var deps = servicios[i];
        for (var x in deps) {
            color = specs.includes(deps[x].toLowerCase()) ? "green" : 'red';
            g.createNode(deps[x], { color: color });
            g.createEdge([i, deps[x]], { dir: edgeDir });
        }
    }
}
var dot = (0, ts_graphviz_1.toDot)(g);
(0, node_1.exportToFile)(dot, {
    format: 'png',
    output: path_1.default.resolve(__dirname, '../graphs/basico3-' + modo + '.png')
});
