"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.componentes = void 0;
exports.componentes = {
    AppController: ["AppService"],
    AppModule: ["AppController", "AppService"],
    AppService: [],
    CatsModule: ["CatController", "CatsService"],
    CatController: ["CatsService"],
    CatsService: ["Cat"],
    ContactoModule: ["ContactoController", "ContactoService"],
    ContactoController: ["ContactoService"],
    ContactoBaseController: ["ContactoBaseService"],
    ContactoEntity: [],
    ContactoService: ["ContactoEntity", "UsuarioService"],
    ContactoBaseService: ["Connection"],
    EstadoEntity: [],
    UsuarioModule: ["UsuarioController", "UsuarioService"],
    UsuarioController: ["UsuarioService"],
    UsuarioEntity: [],
    UsuarioService: ["UsuarioEntity"],
    Connection: [],
};
