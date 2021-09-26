import { filewalker } from "./filewalker";
import fs from 'fs'

/**
 * Obtiene los archivos del proyecto y los compara con los tests Jest creados con --listTests
 * 
 * @param err 
 * @param archivos 
 */
function generaInformeArchivos(err: any, archivos: string[]) {

    var archivo: string = fs.readFileSync('../base-nest/spec/support/listTests.txt', 'utf-8')
    var specs: string[] = archivo.split('\n').map(spec => spec.split('/').pop()?.replace('.spec', '').toLowerCase() || 'Jarjar')

    for (var i in archivos) {
        //if (specs.includes(res[i].split('/').pop() || ''))
        if (specs.includes(archivos[i].split('/').pop()?.toLowerCase() || '')) 
            archivos[i] += "\t-- ** Test **"
    }

    fs.writeFile('./graphs/informe-base-nest.txt', archivos.join("\n"), error => {
        if (error)
            console.log(error)
        else
            console.log('Todo correcto')
    })

}

filewalker("../base-nest/src", generaInformeArchivos)

