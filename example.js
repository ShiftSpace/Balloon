window.addEvent("domready", init);

function init()
{
  console.log("init");
  new Balloon($("example1"));
  new Balloon($("example2"), {
    pointer: "top"
  });
}