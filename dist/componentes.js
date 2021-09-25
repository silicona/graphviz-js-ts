"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comps = void 0;
exports.comps = {
    moduloUnoController: [
        "moduloUnoServicio",
        "moduloDosServicio",
        "moduloTresServicio",
        "moduloCuatroServicio",
    ],
    moduloUnoServicio: [
        "moduloUnoDal",
        "moduloDosServicio",
        "moduloDosDal",
        "moduloTresDal",
    ],
    moduloDosController: [
        "moduloDosServicio"
    ],
    moduloDosServicio: [
        "moduloDosDal",
        "moduloUnoServicio",
        "moduloTresServicio"
    ],
    moduloDosServicioDos: [
        "moduloDosServicio",
        "moduloDosDal"
    ],
    moduloTresController: [
        "moduloTresServicio",
    ],
    moduloTresServicio: [
        "moduloTresDal",
        "moduloDosServicio",
        "moduloDosServicioDos"
    ],
    moduloCuatroServicio: [
    //"moduloTresDal",
    //"moduloDosServicioDos"
    ],
    moduloUnoDal: [],
    moduloDosDal: [],
    moduloTresDal: [],
};
