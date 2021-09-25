import path from 'path'
import { digraph, Edge, graph, IEdge, toDot } from 'ts-graphviz';
import { exportToFile } from '@ts-graphviz/node';
import fs from 'fs'
import { filewalker } from './filewalker';
import { comps } from './componentes';


let servicios: any = comps
const g = digraph('G', {
    //center: true,
    //margin: 1

})
const subDals = g.createSubgraph('clusterA', {
    rank: "source",
    //style: "filled",
    //style: "striped",
    //style: "rounded striped",
    style: "radial",
    bgcolor: "aqua:red"
});
const subServices = g.createSubgraph('B', { rank: "" });
const subControllers = g.createSubgraph('c', { rank: "sink" });

for (var i in servicios) {
    //console.log(i)
    var shape = "ellipse"
    if (/Dal$/.test(i)) {
        shape = "cylinder"
        subDals.createNode(i);
    } else if (/Controller$/.test(i)) {
        shape = "trapezium"
        //shape="octagon"
        subControllers.createNode(i);
    } else if(/Servicio$/.test(i)){
        subServices.createNode(i)
    }
    g.createNode(i, { shape: shape })
}

var rels: {[key: string]: Edge} = {}

for (var i in servicios) {
    var deps = servicios[i]
    for (var x in deps) {
        if(rels[i + '-' + deps[x]]){            
            g.removeEdge(rels[i + '-' + deps[x]])
            delete rels[i + '-' + deps[x]]
            rels[deps[x] + '-' + i] = g.createEdge([deps[x], i], { dir: "both", color: "red" })
        } else
            rels[deps[x] + '-' + i] = g.createEdge([deps[x], i])
    }
}

const dot = toDot(g)

exportToFile(dot, {
    format: 'png',
    output: path.resolve(__dirname, '../graphs/basico3.png')
})
async function jarjar() {
    return await filewalker('./', console.log)
}


