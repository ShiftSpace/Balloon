window.addEvent("domready", init);

function init()
{
  console.log("init");
  new Balloon($("example1"));
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
}