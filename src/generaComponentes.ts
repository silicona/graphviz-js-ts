/**
 * Genera archivo componentes.ts con las dependencias de los ficheros examinados para crear graficos con Graphviz
 */

import fs from 'fs'
import { filewalker } from './filewalker'

function generaComponentes(err: any, res: string[]) {

    var arr = res.filter(arch => /(module|controller|service|entity)\.ts$/.test(arch))
    var compos: any = {}
    arr.forEach(archivo => {
        var matches, entidad, deps: any = [], depsMod: any = []
        var lineas = fs.readFileSync(archivo, 'utf-8').split("\n")
        lineas.forEach(linea => {
            if (/^import /.test(linea)) return true

            if (matches = linea.match(/^export class (\w+)/)) entidad = matches[1].trim()

            if (/@Inject\('CONNECTION'\)/.test(linea)) deps.push("Connection")
            if (matches = linea.match(/@InjectRepository\((.*)\)/)) deps.push(matches[1].trim())
            if (matches = linea.match(/private readonly [^:]+: ?(\w+)/)) deps.push(matches[1].trim())
            //if (matches = linea.match(/private(?: readonly|)? [^:]+: ?(\w+)/)) deps.push(matches[1].trim())

            if (matches = linea.match(/[^\/]controllers: ?\[([\w,]+)\]?,?/)) depsMod.push(matches[1].trim())

            if (matches = linea.match(/[^\/]providers: ?\[([\w,]+)\]?,?/)) depsMod.push(matches[1].trim())

        })

        if(entidad) {

            if (/Module$/.test(entidad)) {
                console.log(depsMod)
                deps = []
                depsMod.forEach((dep: string) => {
                    var aux: string[] = dep.split(',').filter((dep: any) => dep !== '')
                    console.log(aux)
                    deps = [...deps, ...aux]
                })
            }
            
            compos[entidad] = deps
        }
    })

    var texto = "export const componentes = {\n"
    for (var elem in compos) {
        texto += "\t" + elem + ": " + (compos[elem].length ? "[\"" + compos[elem].join('", "') + "\"]" : "[]" ) + ",\n"
    }
    texto += "\tConnection: [],\n"
    texto += "}"

    fs.writeFile('./src/componentes.ts', texto, error => {
        console.log(error || "Captura correcta")
    })
}

filewalker("../base-nest/src/", generaComponentes)