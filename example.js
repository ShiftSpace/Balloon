window.addEvent("domready", init);

function init()
{
  console.log("init");
  var b1 = new Balloon($("example1"));
  new Balloon($("example2"), {
    pointer: "top"
  });
  new Balloon($("example3"), {
    pointer: "right"
  });
  new Balloon($("example4"), {
    pointer: "bottom"
  });
  new Balloon($("example5"), {
    pointer: "left"
  });
  var b6 = new Balloon($("example6"), {
    pointer: "bottom",
    visible: false,
    anchor: $("clickme")
  });
}