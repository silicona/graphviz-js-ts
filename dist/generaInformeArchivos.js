"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var filewalker_1 = require("./filewalker");
var fs_1 = __importDefault(require("fs"));
/**
 * Obtiene los archivos del proyecto y los compara con los tests Jest creados con --listTests
 *
 * @param err
 * @param archivos
 */
function generaInformeArchivos(err, archivos) {
    var _a;
    var archivo = fs_1.default.readFileSync('../base-nest/spec/support/listTests.txt', 'utf-8');
    var specs = archivo.split('\n').map(function (spec) { var _a; return ((_a = spec.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.spec', '').toLowerCase()) || 'Jarjar'; });
    for (var i in archivos) {
        //if (specs.includes(res[i].split('/').pop() || ''))
        if (specs.includes(((_a = archivos[i].split('/').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || ''))
            archivos[i] += "\t-- ** Test **";
    }
    fs_1.default.writeFile('./graphs/informe-base-nest.txt', archivos.join("\n"), function (error) {
        if (error)
            console.log(error);
        else
            console.log('Todo correcto');
    });
}
(0, filewalker_1.filewalker)("../base-nest/src", generaInformeArchivos);
