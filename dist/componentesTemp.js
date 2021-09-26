"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentes = void 0;
exports.componentes = {
    AppController: ["AppService"],
    AppService: [""],
    CatController: [""],
    CatsService: ["Cat"],
    ContactoController: ["ContactoBaseService"],
    ContactoService: ["ContactoEntity", "UsuarioService"],
    ContactoBaseService: [""],
    UsuarioController: ["UsuarioService"],
    UsuarioService: ["UsuarioEntity"],
};
