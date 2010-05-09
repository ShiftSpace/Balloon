var HalfPI = Math.PI/2;
var ThreeFourths = HalfPI + Math.PI;
var radius = 6.0;
var blur = 8.0;

window.Balloon = new Class({
  Implements: [Events, Options],
  
  defaults: {
    autoPosition: false,
    position: null,
    offset: null,
    animate: true,
    pointer: null /* "top", "left", "right", "bottom" */
  },

  initialize: function(element, options) {
    this.setOptions(options);
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

    ctxt.strokeStyle = "rgba(255, 255, 255, 1)";
    ctxt.lineWidth = 2.0;

    ctxt.save();
    ctxt.fillStyle = "rgba(79, 170, 117, 1)";
    ctxt.shadowColor = "rgba(79, 170, 117, 0.95)";
    ctxt.shadowBlur = blur;

    ctxt.moveTo(blur+radius, blur);
    ctxt.beginPath();
    /* top */
    ctxt.lineTo(blur+radius, blur);
    ctxt.lineTo(blur+size.x-radius, blur);
    ctxt.arc(blur+size.x-radius, blur+radius, radius, -HalfPI, 0, false);
    /* right */
    ctxt.lineTo(blur+size.x, blur+size.y-radius);
    ctxt.arc(blur+size.x-radius, blur+size.y-radius, radius, 0, HalfPI, false);
    /* bottom */
    ctxt.lineTo(blur+radius, blur+size.y);
    ctxt.arc(blur+radius, blur+size.y-radius, radius, HalfPI, -Math.PI, false);
    /* left */
    ctxt.lineTo(blur, blur+radius);
    ctxt.arc(blur+radius, blur+radius, radius, -Math.PI, -HalfPI, false);
    ctxt.fill();

    ctxt.restore();
    ctxt.moveTo(blur+radius, blur);
    ctxt.beginPath();
    /* top */
    ctxt.lineTo(blur+radius, blur);
    ctxt.lineTo(blur+size.x-radius, blur);
    ctxt.arc(blur+size.x-radius, blur+radius, radius, -HalfPI, 0, false);
    /* right */
    ctxt.lineTo(blur+size.x, blur+size.y-radius);
    ctxt.arc(blur+size.x-radius, blur+size.y-radius, radius, 0, HalfPI, false);
    /* bottom */
    ctxt.lineTo(blur+radius, blur+size.y);
    ctxt.arc(blur+radius, blur+size.y-radius, radius, HalfPI, -Math.PI, false);
    /* left */
    ctxt.lineTo(blur, blur+radius);
    ctxt.arc(blur+radius, blur+radius, radius, -Math.PI, -HalfPI, false);
    ctxt.stroke();
  },

  show: function() {
    this.fireEvent("show", this);
  },

  hide: function() {
    this.fireEvent("hide", this);
  },

  setPointer: function(side)
  {
    this.pointer = side;
  }
});