import path from 'path'
import { digraph, Edge, EdgeTargetLikeTuple, graph, IEdge, toDot } from 'ts-graphviz';
import { exportToFile } from '@ts-graphviz/node';
import fs from 'fs'
import { componentes } from './componentes';

var modo = "dependencia"
var subDalRank = "source"
var subContRank = "sink"
var edgeDir = "forward"
var rankDir = "TB"

process.argv.forEach(arg => {
  var matches
  if (matches = arg.match(/mode=(\w+)/)) {
    modo = matches[1]
    switch (modo) {
      case "funcionalidad":
        subDalRank = "sink"
        subContRank = "source"
        edgeDir = "back"
        break
      case "modulo":
        //rankDir = "LR"
        break;
      default:
    }
  }
})

let servicios: any = componentes
var archivo: string = fs.readFileSync('../base-nest/spec/support/listTests.txt', 'utf-8')
var specs: string[] = archivo.split('\n').map(spec => spec.split('/').pop()?.replace('.spec.ts', '').replace('.', '').toLowerCase() || 'Jarjar')

const g = digraph('G', {
  id: 'graphJar',
  rankdir: rankDir
  /*
  center: true, 
  margin: 1
  */
})

//g.set('id', 'graphJar')

if (modo !== "modulo") {

  const subDals = g.createSubgraph('clusterA', {
    rank: subDalRank,
    style: "rounded", // "filled", "striped", "rounded striped", "radial",
    bgcolor: "aqua:white", // "aqua:red"
  });
  const subServices = g.createSubgraph('B', { rank: "" });
  const subControllers = g.createSubgraph('c', { rank: subContRank });

  for (var i in componentes) {

    if (/Module$/.test(i)) continue

    var shape = "ellipse"
    var color = "red"
    if (specs.includes(i.toLowerCase() || '')) color = "green"
    
    if (/(Connection|Entity|Dal)$/.test(i)) {
      shape = "cylinder"
      subDals.createNode(i);
    } else if (/Controller$/.test(i)) {
      shape = "trapezium"
      subControllers.createNode(i);
    } else if (/Service$/.test(i)) {
      subServices.createNode(i)
    }

    g.createNode(i, { 
      shape: shape,
      color: color,
      //fontcolor: color,
      //fillcolor: color, 
      //style: "striped"
    })
  }

  // Guarda los edges para corregir los edges dobles
  var rels: { [key: string]: Edge } = {}

  for (var i in servicios) {
    if (/Module$/.test(i)) continue

    var deps = servicios[i].deps
    for (var x in deps) {

      var edgePoints: EdgeTargetLikeTuple = [deps[x], i]
      if (modo == "funcionalidad")
        edgePoints = [i, deps[x]]

      // Ajuste edge doble en rojo de dependencia
      if (rels[i + '-' + deps[x]]) {
        g.removeEdge(rels[i + '-' + deps[x]])
        delete rels[i + '-' + deps[x]]
        rels[deps[x] + '-' + i] = g.createEdge(edgePoints, { dir: "both", color: "red" })
      } else
        rels[deps[x] + '-' + i] = g.createEdge(edgePoints, { dir: edgeDir })
    }
  }

} else {
  for (var i in servicios) {
    if (!/Module$/.test(i)) continue

    color = specs.includes(i.toLowerCase()) ? "green" : "red"
    g.createNode(i, { color: color })
    
    var deps = servicios[i].deps
    for (var x in deps) {
      color = specs.includes(deps[x].toLowerCase()) ? "green" : 'red'
      g.createNode(deps[x], { color: color })
      
      g.createEdge([i, deps[x]], { dir: edgeDir })
    }
  }
}

const dot = toDot(g)

exportToFile(dot, {
  format: 'png',
  output: path.resolve(__dirname, '../graphs/app-' + modo + '.png')
})

exportToFile(dot, {
  format: 'json',
  output: path.resolve(__dirname, '../graphs/app-' + modo + '.json')
})

exportToFile(dot, {
  format: 'svg',
  output: path.resolve(__dirname, '../graphs/app-' + modo + '.svg')
})
