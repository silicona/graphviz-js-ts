import path from 'path'
import { digraph, graph, toDot } from 'ts-graphviz';
import { exportToFile } from '@ts-graphviz/node';
import fs from 'fs'
import { filewalker } from './filewalker';
import { comps } from './componentes';

let servicios: any = comps
const g = graph('G', { 
    center: true,
    //layout: "fdp",
    layout: "twopi",
    root: "moduloUnoController",
    ranksep: 2,
    //layout: "circo"
    //layout: "neato",
    //splines: "polyline",
    //splines: "ortho"
    splines: "true"
})
const subDals = g.createSubgraph('clusterA', { rank: "source" });
const subServices = g.createSubgraph('B', { rank: "" });
const subControllers = g.createSubgraph('clusterC', { rank: "sink" });
//const subgraphA = g.createSubgraph('A', { rank: "sink" });

for( var i in servicios){
    //console.log(i)
    var shape = "ellipse"
    if(/Dal$/.test(i)) {
        shape = "cylinder"
        subDals.createNode(i);
    } else if(/Controller$/.test(i)) {
        shape="octagon"
        subControllers.createNode(i);
    } else {
        subServices.createNode(i)
    }
    g.createNode(i, { shape: shape })
}

for( var i in servicios){
    var deps = servicios[i]
    for( var x in deps) {
        g.createEdge([deps[x], i])
        //g.createEdge([i, deps[x]])
    }
}

const dot = toDot(g)

exportToFile(dot, {
    format: 'png',
    output: path.resolve(__dirname, '../graphs/basico-twopi.png')
})
/*
exportToFile(dot, {
    format: 'pdf',
    output: path.resolve(__dirname, '../graphs/basico-graph.pdf')
})*/
async function jarjar(){
    return await filewalker('./', console.log)
}


