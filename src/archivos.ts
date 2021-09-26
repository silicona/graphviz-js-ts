import { filewalker } from "./filewalker";
import fs from 'fs'

function recolecta(err: any, res: string[]) {

    var archivo: string = fs.readFileSync('./graphs/specs.txt', 'utf-8')
    var datas: string[] = archivo.split('\n').map(spec => spec.split('/').pop()?.replace('.spec', '') || 'Jarjar')

    for(var i in res){
        if(datas.includes(res[i].split('/').pop() || '')) res[i] += "\t-- ** Test **" 
    }

    fs.writeFile('./graphs/listado.txt', res.join("\n"), error => {
        if(error)
            console.log(error)
        else
            console.log('Todo correcto')
    })

}

filewalker("./", recolecta)