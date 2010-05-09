var HalfPI = Math.PI/2,
    radius = 6.0,
    blur = 8.0,
    pointerSize = 10.0;

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
    this.setPointer(this.options.pointer);
    var size = element.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize : 0));
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
      marginLeft: pad,
      marginTop: pad
    });
    this.wrapper.grab(this.element.dispose());
    this.wrapper.setStyles({
      width: size.x+(2*pad),
      height: size.y+(2*pad)
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

  path: function() {
    var ctxt = this.balloon.getContext("2d"),
        size = this.element.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize : 0));

    ctxt.moveTo(pad+radius, pad);
    ctxt.beginPath();
    /* top */
    ctxt.lineTo(pad+radius, pad);
    if(this.pointer == "top"){
      ctxt.lineTo(pad+(size.x/2.0)-(pointerSize/2.0), pad);
      ctxt.lineTo(pad+(size.x/2.0)+(pointerSize/2.0), pad-pointerSize);
      ctxt.lineTo(pad+(size.x/2.0)+pointerSize, pad);
    }
    ctxt.lineTo(pad+size.x-radius, pad);      
    ctxt.arc(pad+size.x-radius, pad+radius, radius, -HalfPI, 0, false);
    /* right */
    ctxt.lineTo(pad+size.x, pad+size.y-radius);
    ctxt.arc(pad+size.x-radius, pad+size.y-radius, radius, 0, HalfPI, false);
    /* bottom */
    ctxt.lineTo(pad+radius, pad+size.y);
    ctxt.arc(pad+radius, pad+size.y-radius, radius, HalfPI, -Math.PI, false);
    /* left */
    ctxt.lineTo(pad, pad+radius);
    ctxt.arc(pad+radius, pad+radius, radius, -Math.PI, -HalfPI, false);
  },

  refresh: function() {
    var ctxt = this.balloon.getContext("2d"),
        size = this.element.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize : 0));

    this.balloon.set("width", size.x+(2*pad));
    this.balloon.set("height", size.y+(2*pad));
    this.balloon.setStyles({
      width: size.x+(2*pad),
      height: size.y+(2*pad)
    });

    ctxt.strokeStyle = "rgba(255, 255, 255, 1)";
    ctxt.lineWidth = 2.0;

    ctxt.save();
    ctxt.fillStyle = "rgba(79, 170, 117, 1)";
    ctxt.shadowColor = "rgba(79, 170, 117, 0.95)";
    ctxt.shadowBlur = pad;

    this.path();
    ctxt.fill();

    ctxt.restore();
    this.path();
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