import path from 'path'
import { digraph, toDot } from 'ts-graphviz';
import { exportToFile } from '@ts-graphviz/node';
import fs from 'fs'
import { filewalker } from './filewalker';

let servicios: any = {
    Servicio1: [
        "Servicio2",
        "Servicio3",
        "Servicio4"
    ],
    Servicio2: [
        "Servicio3"
    ],
    Servicio3: [
        "Servicio2"
    ]
}

const g = digraph('G')
var nodos = []

for( var i in servicios){
    nodos.push(g.createNode(i))
}

for( var i in servicios){
    var deps = servicios[i]
    for( var x in deps) {
        g.createEdge([i, deps[x]])
    }
}

const dot = toDot(g)

exportToFile(dot, {
    format: 'png',
    output: path.resolve(__dirname, '../graphs/basico3.png')
})
async function jarjar(){
    return await filewalker('./', console.log)
}


