"use strict";
/**
 * Genera archivo componentes.ts con las dependencias de los ficheros examinados para crear graficos con Graphviz
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var filewalker_1 = require("./filewalker");
function generaComponentes(err, res) {
    var arr = res.filter(function (arch) { return /(module|controller|service|entity)\.ts$/.test(arch); });
    var compos = {};
    arr.forEach(function (archivo) {
        var matches, entidad, deps = [], depsMod = [];
        var lineas = fs_1.default.readFileSync(archivo, 'utf-8').split("\n");
        lineas.forEach(function (linea) {
            if (/^import /.test(linea))
                return true;
            if (matches = linea.match(/^export class (\w+)/))
                entidad = matches[1].trim();
            if (/@Inject\('CONNECTION'\)/.test(linea))
                deps.push("Connection");
            if (matches = linea.match(/@InjectRepository\((.*)\)/))
                deps.push(matches[1].trim());
            if (matches = linea.match(/private readonly [^:]+: ?(\w+)/))
                deps.push(matches[1].trim());
            //if (matches = linea.match(/private(?: readonly|)? [^:]+: ?(\w+)/)) deps.push(matches[1].trim())
            if (matches = linea.match(/[^\/]controllers: ?\[([\w,]+)\]?,?/))
                depsMod.push(matches[1].trim());
            if (matches = linea.match(/[^\/]providers: ?\[([\w,]+)\]?,?/))
                depsMod.push(matches[1].trim());
        });
        if (entidad) {
            if (/Module$/.test(entidad)) {
                console.log(depsMod);
                deps = [];
                depsMod.forEach(function (dep) {
                    var aux = dep.split(',').filter(function (dep) { return dep !== ''; });
                    console.log(aux);
                    deps = __spreadArray(__spreadArray([], deps, true), aux, true);
                });
            }
            compos[entidad] = deps;
        }
    });
    var texto = "export const componentes = {\n";
    for (var elem in compos) {
        texto += "\t" + elem + ": " + (compos[elem].length ? "[\"" + compos[elem].join('", "') + "\"]" : "[]") + ",\n";
    }
    texto += "\tConnection: [],\n";
    texto += "}";
    fs_1.default.writeFile('./src/componentes.ts', texto, function (error) {
        console.log(error || "Captura correcta");
    });
}
(0, filewalker_1.filewalker)("../base-nest/src/", generaComponentes);
