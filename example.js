window.addEvent("domready", init);

function init()
{
  console.log("init");
  new Balloon($("example"));
}