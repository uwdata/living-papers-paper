function _1(){return(
128
)}

function _2(Inputs,init){return(
Inputs.range([0, 255], {step: 1, value: init})
)}

function _3(){return(
new Intl.NumberFormat().format
)}

function _4(Plot,a,d3){return(
Plot.plot({
  marginLeft: 50,
  y: { grid: true },
  marks: [
    Plot.ruleX([a], { stroke: '#888' }),
    Plot.line(d3.range(0, Math.max(256, a)), { x: d => d, y: d => d * d, stroke: 'steelblue', strokeWidth: 2 }),
    Plot.dot([a], { x: d => d, y: d => d * d, fill: 'steelblue' })
  ],
  height: 300
})
)}

function _5(a){return(
a
)}

function _6(format,a){return(
format(a * a)
)}

export default function define(runtime, observer) {
 const main = runtime.module();
 main.variable(observer("init")).define("init", [], _1);
 main.variable(observer("viewof a")).define("viewof a", ["Inputs", "init"], _2);
 main.variable(observer("a")).define("a", ["Generators", "viewof a"], (G, _) => G.input(_));
 main.variable(observer("format")).define("format", [], _3);
 main.variable(observer("plot")).define("plot", ["Plot", "a", "d3"], _4);
 main.variable(observer()).define(["a"], _5);
 main.variable(observer()).define(["format", "a"], _6);
 return main;
}
