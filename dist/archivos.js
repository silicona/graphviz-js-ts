"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var filewalker_1 = require("./filewalker");
var fs_1 = __importDefault(require("fs"));
function recolecta(err, res) {
    var archivo = fs_1.default.readFileSync('./graphs/specs.txt', 'utf-8');
    var datas = archivo.split('\n').map(function (spec) { var _a; return ((_a = spec.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.spec', '')) || 'Jarjar'; });
    for (var i in res) {
        if (datas.includes(res[i].split('/').pop() || ''))
            res[i] += "\t-- ** Test **";
    }
    fs_1.default.writeFile('./graphs/listado.txt', res.join("\n"), function (error) {
        if (error)
            console.log(error);
        else
            console.log('Todo correcto');
    });
}
(0, filewalker_1.filewalker)("./", recolecta);
