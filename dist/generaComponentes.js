"use strict";
/**
 * Genera archivo componentes.ts con las dependencias de los ficheros examinados para crear graficos con Graphviz
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var filewalker_1 = require("./filewalker");
function generaComponentes(err, res) {
    var arr = res.filter(function (arch) { return /(module|controller|service|entity)\.ts$/.test(arch); });
    var componentes = {};
    arr.forEach(function (archivo) {
        var _a, _b, _c;
        var componente = null, items = {};
        var datos = fs_1.default.readFileSync(archivo, 'utf-8');
        var lineas = datos.split("\n");
        if (/@Entity/.test(datos)) {
            (_a = generaEntidad(lineas), componente = _a.componente, items = _a.items);
        }
        else if (/@Module/.test(datos)) {
            (_b = generaModulo(lineas), componente = _b.componente, items = _b.items);
        }
        else {
            (_c = generaComponente(lineas), componente = _c.componente, items = _c.items);
        }
        if (componente)
            componentes[componente] = items;
    });
    var texto = construyeTexto(componentes);
    fs_1.default.writeFile('./src/componentes.ts', texto, function (error) {
        console.log(error || "Captura correcta");
    });
}
var generaComponente = function (lineas) {
    var matches, componente = "";
    var itemsComp = { deps: [], methods: {} };
    var bucle = false, bucleName = "", contador = 0;
    lineas.forEach(function (linea) {
        if (/^import /.test(linea))
            return true;
        if (matches = linea.match(/^export class (\w+)/))
            componente = matches[1].trim();
        if (matches = linea.match(/^@Controller\s?\((?:'|")([^'"]+)(?:'|")\)/))
            itemsComp.e2e = matches[1].trim();
        // Dependencias
        if (/@Inject\('CONNECTION'\)/.test(linea))
            itemsComp.deps.push("Connection");
        if (matches = linea.match(/@InjectRepository\((.*)\)/))
            itemsComp.deps.push(matches[1].trim());
        if (matches = linea.match(/private readonly [^:]+: ?(\w+)/))
            itemsComp.deps.push(matches[1].trim());
        if (/\s(?:\/\/)?@/.test(linea))
            return true;
        if (!bucle && (matches = linea.match(/\s(private )?(\w+)\s?=\s?(async )?\(([^\)]+)?\)(?:\s?([^\=]+))?/))) {
            //if (matches = linea.match(/\spublic async (\w+)\(([^\)]+)\)(?:\s?([^\{\=]+))?/)) {
            var methodName = matches[2].trim();
            if (!/(constructor|super)/.test(methodName)) {
                var params = null;
                if (matches[4]) {
                    params = matches[4].trim().split(',').map(function (param) {
                        var partes = param.split(':').map(function (p) { return p.trim(); });
                        if (partes[1])
                            return partes[0] + "(" + partes[1] + ")";
                        return partes[0];
                    });
                }
                itemsComp.methods[methodName] = {
                    public: !(!!matches[1]),
                    async: !!matches[3],
                    name: methodName,
                    params: params,
                    return: matches[5] ? matches[5].replace(/(:|\s|\<|\>|Promise)/g, '') : "any"
                };
                bucleName = methodName;
                contador = 0;
            }
            bucle = true;
        }
        if (!bucle && (matches = linea.match(/\s(private )?(async )?(\w+)\(([^\)]+)?\)(?:\s?([^\{\=]+))?/))) {
            //if (matches = linea.match(/\spublic async (\w+)\(([^\)]+)\)(?:\s?([^\{\=]+))?/)) {
            var methodName = matches[3].trim();
            if (!/constructor|super/.test(methodName)) {
                var params = null;
                if (matches[4]) {
                    params = matches[4].trim().split(',').map(function (param) {
                        var partes = param.split(':').map(function (p) { return p.trim(); });
                        if (partes[1])
                            return partes[0] + "(" + partes[1] + ")";
                        return partes[0];
                    });
                }
                itemsComp.methods[methodName] = {
                    public: !(!!matches[1]),
                    async: !!matches[2],
                    name: methodName,
                    params: params,
                    return: matches[5] ? matches[5].replace(/(:|\s|\<|\>|Promise)/g, '') : "any"
                };
                bucleName = methodName;
                contador = 0;
            }
            bucle = true;
        }
        if (bucle) {
            if (/\s\}/.test(linea)) {
                bucle = false;
                if (bucleName)
                    itemsComp.methods[bucleName].lines = contador;
            }
            else {
                contador++;
            }
        }
        //if (deps.length) items.deps = deps
    });
    //console.log('Funcion', componente)
    return { componente: componente, items: { itemsComp: itemsComp } };
};
var generaEntidad = function (lineas) {
    var matches, componente = "";
    var itemsBd = { campos: {}, indexs: {} }, campo = {};
    var bucle = false;
    lineas.forEach(function (linea) {
        linea = linea.trim();
        if (/^import /.test(linea))
            return true;
        if (matches = linea.match(/^@Index\((?:'|")([^'"]+)(?:'|"),\s?\[([^\]]+)\]/)) {
            itemsBd.indexs[matches[1].trim()] = matches[2].trim().split(',');
        }
        if (matches = linea.match(/^@Entity\s?\((?:'|")([^'"]+)(?:'|")\)/)) {
            itemsBd.tabla = matches[1].trim();
            itemsBd.bd = "DefaultDB";
        }
        else if (matches = linea.match(/^@Entity\s?\((?:'|")([^'"]+)(?:'|"),\s?\{\s?schema\:\s?(?:'|")([^'"]+)(?:'|")\s?\}\s?\)/)) {
            itemsBd.tabla = matches[1].trim();
            itemsBd.bd = matches[2].trim();
        }
        if (matches = linea.match(/^export class (\w+)/))
            componente = matches[1].trim();
        if (matches = linea.match(/^@PrimaryGeneratedColumn\(\{([^\}]+)\}\)/)) {
            // if (matches = linea.match(/^@PrimaryGeneratedColumn\(\{\s?type:\s?(?:'|")([^'"]+)(?:'|"),\s?name:\s?(?:'|")([^'"]+)(?:'|")\s?\}/)) {
            bucle = true;
            campo = devuelveCampo(matches);
        }
        else if (matches = linea.match(/^@Column\(\s?(?:'|")([^'"]+)(?:'|"),\s?\{([^\}]+)\}/)) {
            // if (matches = linea.match(/^@Column\(\s?(?:'|")([^'"]+)(?:'|"),\s?\{\s?name:\s?(?:'|")([^'"]+)(?:'|")\s?/)) {
            bucle = true;
            campo = devuelveCampo(matches);
        }
        if (bucle && linea.match(/@/))
            return true;
        if (bucle && (matches = linea.match(/(\w+):\s?(\w+)/))) {
            bucle = false;
            campo.entityName = matches[1].trim();
            campo.entityType = matches[2].trim();
            itemsBd.campos[campo.entityName] = campo;
        }
    });
    return { componente: componente, items: { itemsBd: itemsBd } };
};
var generaModulo = function (lineas) {
    var matches, componente = "";
    var itemsMod = { imports: [], controllers: [], providers: [], exports: [] };
    var bucle = false, itemBucle; // = "imports"
    var regCleaner = /(\.forRoot|\{\s?isGlobal\:\s?true\s?\}|TypeOrmModule\.forRootAsync|TypeOrmModule\.forFeature|forwardRef)/g;
    lineas.forEach(function (linea) {
        linea = linea.trim();
        if (/^import /.test(linea))
            return true;
        if (matches = linea.match(/^(imports|controllers|providers|exports):\s?\[(.*)/)) {
            itemBucle = matches[1];
            if (!/\]/.test(matches[2]))
                bucle = true;
            var valor = matches[2].replace(/[\[\]\(\),]/g, "").trim();
            if (valor.length) {
                valor = valor.replace(regCleaner, '');
                if (itemBucle != 'imports' || /Module/.test(valor))
                    itemsMod[itemBucle].push(valor);
            }
        }
        if (bucle && (matches = linea.match(/(.*)/)) && matches[0].indexOf(itemBucle) == -1) {
            if (/\]\,$/.test(matches[1]))
                bucle = false;
            var valor = matches[1].replace(/[\[\]\(\),]/g, "").trim();
            if (valor.length) {
                valor = valor.replace(regCleaner, '');
                if (itemBucle != 'imports' || /Module/.test(valor))
                    itemsMod[itemBucle].push(valor);
            }
            else {
                bucle = false;
            }
        }
        if (matches = linea.match(/^export class (\w+)/))
            componente = matches[1].trim();
    });
    return { componente: componente, items: { itemsMod: itemsMod } };
};
var devuelveCampo = function (matches) {
    var campo = {};
    var attrs = matches[1].trim();
    campo.primary = true;
    // Viene de @Column
    if (matches[2]) {
        campo.type = attrs;
        campo.primary = false;
        attrs = matches[2].trim();
    }
    campo = attrs.split(',').reduce(function (acc, str) {
        var partes = str.split(':').map(function (parte) { return parte.trim(); });
        acc[partes[0]] = Number(partes[1]);
        if (isNaN(acc[partes[0]]))
            acc[partes[0]] = partes[1].replace(/['"]/g, "");
        if (acc[partes[0]] === 'null')
            acc[partes[0]] = null;
        if (acc[partes[0]] === 'false')
            acc[partes[0]] = false;
        if (acc[partes[0]] === 'true')
            acc[partes[0]] = true;
        return acc;
    }, campo);
    // Campos False por defecto
    campo.nullable = !!campo.nullable;
    campo.primary = !!campo.primary;
    return campo;
};
var construyeTexto = function (componentes) {
    var texto = "export const componentes = {\n";
    for (var elemento in componentes) {
        texto += "\t" + elemento + ": {\n";
        if (componentes[elemento].itemsComp) {
            if (componentes[elemento].itemsComp.e2e)
                texto += "\t\te2e: \"" + componentes[elemento].itemsComp.e2e + "\",\n";
            texto += "\t\tdeps: [\"" + componentes[elemento].itemsComp.deps.join('", "') + "\"],\n";
            texto += "\t\tmethods: {\n";
            var methods = componentes[elemento].itemsComp.methods;
            for (var meth in methods) {
                texto += "\t\t\t" + meth + ": {\n";
                for (var i in methods[meth]) {
                    var valor_1 = void 0;
                    if (typeof methods[meth][i] === 'string')
                        valor_1 = "\"" + methods[meth][i] + "\"";
                    else if (methods[meth][i] && methods[meth][i].length)
                        valor_1 = "[\"" + methods[meth][i].join('","') + "\"]";
                    else
                        valor_1 = methods[meth][i];
                    //var valor = typeof methods[meth][i] === 'string' ? "\"" + methods[meth][i] + "\"" : methods[meth][i]
                    texto += "\t\t\t\t" + i + ": " + valor_1 + ",\n";
                }
                texto += "\t\t\t},\n";
            }
            texto += "\t\t},\n";
        }
        if (componentes[elemento].itemsBd) {
            for (var i in componentes[elemento].itemsBd) {
                if (typeof componentes[elemento].itemsBd[i] == 'string')
                    texto += "\t\t" + i + ": \"" + componentes[elemento].itemsBd[i] + "\",\n";
                else if (i == "campos") {
                    texto += "\t\tcampos: {\n";
                    var campos = componentes[elemento].itemsBd.campos;
                    for (var index in campos) {
                        texto += "\t\t\t" + index + ": {\n";
                        for (var attr in campos[index]) {
                            var valor = typeof campos[index][attr] === 'string' ? "\"" + campos[index][attr] + "\"" : campos[index][attr];
                            texto += "\t\t\t\t" + attr + ": " + valor + ",\n";
                        }
                        texto += "\t\t\t},\n";
                    }
                    texto += "\t\t},\n";
                }
                else if (i == "indexs") {
                    texto += "\t\tindexs: {\n";
                    var indexs = componentes[elemento].itemsBd.indexs;
                    for (var index in indexs) {
                        texto += "\t\t\t" + index + ": [" + indexs[index].join(',') + "],\n";
                        //for (var attr in indexs[index]) texto += "\t\t\t\t" + attr + ": \"" + indexs[index][attr] + "\",\n"
                        //texto += "\t\t\t},\n"
                    }
                    texto += "\t\t},\n";
                }
            }
        }
        if (componentes[elemento].itemsMod) {
            for (var i in componentes[elemento].itemsMod) {
                texto += "\t\t" + i + ": [\"" + componentes[elemento].itemsMod[i].join('", "') + "\"],\n";
            }
        }
        texto += "\t},\n";
    }
    texto += "\tConnection: {},\n";
    texto += "}";
    return texto;
};
(0, filewalker_1.filewalker)("../base-nest/src/", generaComponentes);
