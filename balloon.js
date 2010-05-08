var HalfPI = Math.PI/2;
var ThreeFourths = HalfPI + Math.PI;
var border = 4.0;

var Balloon = new Class({
  initialize: function(element) {
    var size = element.getSize();
    this.element = element;
    this.wrapper = new Element("div", {
      "class": "ss-balloon-wrapper"
    });
    this.balloon = new Element("canvas", {
      "styles": {
        zIndex: 0
      },
      "class": "ss-balloon"
    });
    this.element.setStyles({
      position: "absolute",
      zIndex: 1
    });
    this.wrapper.grab(this.element.dispose());
    this.wrapper.setStyles({
      width: size.x+(2*border),
      height: size.y+(2*border)
    });
    this.wrapper.grab(this.balloon);
    document.body.grab(this.wrapper);
    this.refresh();
  },

  set: function(property, value) {
    if(property == "target") {
    }
    this.element.set(property, value);
    this.refresh();
  },

  refresh: function() {
    var ctxt = this.balloon.getContext("2d"),
        size = this.element.getSize();

    this.balloon.set("width", size.x);
    this.balloon.set("height", size.y);
    this.balloon.setStyles({
      width: size.x,
      height: size.y
    });

    ctxt.fillStyle = "rgba(79, 170, 117, 1)";
    ctxt.strokeStyle = "rgba(255, 255, 255, 1)";
    ctxt.shadowColor = "rgba(79, 170, 117, 0.5)";
    ctxt.shadowBlur = 4.0;

    ctxt.moveTo(border, border);
    ctxt.beginPath();
    ctxt.lineTo(size.x, 0);
    ctxt.arc(size.x-border, size.x, size.x, HalfPI, 0, false);
    ctxt.lineTo(size.x, size.y-border);
    ctxt.arc(size.x-border, size.y-border, border, 0, -(ThreeFourths), false);
    ctxt.lineTo(border, size.y);
    ctxt.arc(border, size.y-border, border, -(ThreeFourths), -Math.PI, false);
    ctxt.lineTo(0, border);
    ctxt.arc(border, border, border, -Math.PI, -HalfPI, false);
    ctxt.fill()
  },

  show: function() {
    this.fireEvent("show", this);
  },

  hide: function() {
    this.fireEvent("hide", this);
  }
});