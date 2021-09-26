"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var ts_graphviz_1 = require("ts-graphviz");
var node_1 = require("@ts-graphviz/node");
var filewalker_1 = require("./filewalker");
var componentes_1 = require("./componentes");
var servicios = componentes_1.componentes;
var g = (0, ts_graphviz_1.graph)('G', {
    center: true,
    //layout: "fdp",
    layout: "twopi",
    root: "moduloUnoController",
    ranksep: 2,
    //layout: "circo"
    //layout: "neato",
    //splines: "polyline",
    //splines: "ortho"
    splines: "true"
});
var subDals = g.createSubgraph('clusterA', { rank: "source" });
var subServices = g.createSubgraph('B', { rank: "" });
var subControllers = g.createSubgraph('clusterC', { rank: "sink" });
//const subgraphA = g.createSubgraph('A', { rank: "sink" });
for (var i in servicios) {
    //console.log(i)
    var shape = "ellipse";
    if (/Dal$/.test(i)) {
        shape = "cylinder";
        subDals.createNode(i);
    }
    else if (/Controller$/.test(i)) {
        shape = "octagon";
        subControllers.createNode(i);
    }
    else {
        subServices.createNode(i);
    }
    g.createNode(i, { shape: shape });
}
for (var i in servicios) {
    var deps = servicios[i];
    for (var x in deps) {
        g.createEdge([deps[x], i]);
        //g.createEdge([i, deps[x]])
    }
}
var dot = (0, ts_graphviz_1.toDot)(g);
(0, node_1.exportToFile)(dot, {
    format: 'png',
    output: path_1.default.resolve(__dirname, '../graphs/basico-twopi.png')
});
/*
exportToFile(dot, {
    format: 'pdf',
    output: path.resolve(__dirname, '../graphs/basico-graph.pdf')
})*/
function jarjar() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, filewalker_1.filewalker)('./', console.log)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
