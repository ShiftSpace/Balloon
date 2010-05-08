var HalfPI = Math.PI/2;
var ThreeFourths = HalfPI + Math.PI;
var radius = 4.0;
var blur = 8.0;

window.Balloon = new Class({
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
      zIndex: 1,
      marginLeft: blur,
      marginTop: blur
    });
    this.wrapper.grab(this.element.dispose());
    this.wrapper.setStyles({
      width: size.x+(2*blur),
      height: size.y+(2*blur)
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

    this.balloon.set("width", size.x+(2*blur));
    this.balloon.set("height", size.y+(2*blur));
    this.balloon.setStyles({
      width: size.x+(2*blur),
      height: size.y+(2*blur)
    });

    console.log(size);

    ctxt.strokeStyle = "rgba(255, 255, 255, 1)";
    ctxt.lineWidth = 2.0;

    ctxt.save();
    ctxt.fillStyle = "rgba(79, 170, 117, 1)";
    ctxt.shadowColor = "rgba(79, 170, 117, 0.95)";
    ctxt.shadowBlur = blur;

    ctxt.beginPath();
    ctxt.lineTo(blur+radius, blur);
    ctxt.lineTo(blur+size.x-radius, blur);
    ctxt.lineTo(blur+size.x, blur+radius);
    ctxt.lineTo(blur+size.x, blur+size.y-radius);
    ctxt.lineTo(blur+size.x-radius, blur+size.y);
    ctxt.lineTo(blur+radius, blur+size.y);
    ctxt.lineTo(blur, blur+size.y-radius);
    ctxt.lineTo(blur, blur+radius);
    ctxt.closePath();
    ctxt.fill();

    ctxt.restore();
    ctxt.moveTo(blur+radius, blur);
    ctxt.beginPath();
    ctxt.lineTo(blur+radius, blur);
    ctxt.lineTo(blur+size.x-radius, blur);
    ctxt.lineTo(blur+size.x, blur+radius);
    ctxt.lineTo(blur+size.x, blur+size.y-radius);
    ctxt.lineTo(blur+size.x-radius, blur+size.y);
    ctxt.lineTo(blur+radius, blur+size.y);
    ctxt.lineTo(blur, blur+size.y-radius);
    ctxt.lineTo(blur, blur+radius);
    ctxt.closePath();
    ctxt.stroke();
  },

  show: function() {
    this.fireEvent("show", this);
  },

  hide: function() {
    this.fireEvent("hide", this);
  }
});