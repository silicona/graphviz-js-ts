//import { JuegoDeLaVidaTDDFront } from './juego.front';
/*
window.addEventListener("load", main);
 
function main() {


  //let micanvas: HTMLCanvasElement = document.getElementById("areajuego") as HTMLCanvasElement;
  //let juego: JuegoDeLaVidaTDDFront;
  //let micanvas: HTMLCanvasElement = document.getElementById("areajuego") as HTMLCanvasElement;
  //let ctx: CanvasRenderingContext2D | null = micanvas.getContext("2d");
 
  if (ctx == null) {
    console.log("Imposible recuperar contexto pintado");
    return;
  }
 
  //juego = new JuegoDeLaVidaTDDFront(ctx);
  //juego.timer = setInterval(juego.anima, 400);
}
*/ $(function() {
    $('#graphJar').on('click', function() {
        console.log('Jarjajar');
    });
    document.querySelectorAll('svg[data-src]').forEach((svg)=>{
        //console.log(svg);
        /* Cargamos el contenido en su HTML interno */ fetch(svg.dataset.src).then(async (respuesta)=>{
            console.log(await respuesta.text());
            return await respuesta.text();
        }).then((xml)=>svg.innerHTML = xml
        );
    });
}) /*
  function loadSVG(graph_id: any) {
    $('#graph').svg({             //renders SVG in this div
        loadURL : '/graphs/' + graph_id + '/render/'
    });
    return $('#graph').svg('get');
  var div = $('#graph img')
  console.log(div)
  $("#graph").graphviz({
    url: "demo.svg",
    ready: function () {
      var gv = this
      gv.nodes().click(function () {
        var $set = $()
        $set.push(this)
        $set = $set.add(gv.linkedFrom(this, true))
        $set = $set.add(gv.linkedTo(this, true))
        gv.highlight($set, true)
        gv.bringToFront($set)
      })
      $(document).keydown(function (evt) {
        if (evt.keyCode == 27) {
          gv.highlight()
        }
      })
    }
  });
})
*/ ;

//# sourceMappingURL=index.fb5312c9.js.map
