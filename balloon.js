var HalfPI = Math.PI/2,
    radius = 6.0,
    blur = 8.0,
    pointerSize = 10.0,
    borderWidth = 2.0;

var SSFx = {};
SSFx.Morph = Class.refactor(Fx.Morph, {
  name: "SSFx.Morph",
  step: function() {
    this.previous();
    this.fireEvent("step", this.subject);
  }
});

var Vector = new Class({
  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },

  add: function(v) {
    return new Vector(this.x+v.x, this.y+v.y);
  },

  sub: function(v) {
    return new Vector(this.x-v.x, this.y-v.y);
  },

  div: function(s) {
    return new Vector(this.x/s, this.y/s);
  },

  mul: function(s) {
    return new Vector(this.x*s, this.y*s);
  },

  xcomp: function() {
    return new Vector(this.x, 0);
  },

  ycomp: function() {
    return new Vector(0, this.y);
  },

  invert: function() {
    return new Vector(-this.y, this.x);
  }
});

Vector.toVector = function(size) {
  if(size.width) return new Vector(size.width, size.height);
  if(size.x) return new Vector(size.x, size.y);
  return null;
};

window.Balloon = new Class({
  Implements: [Events, Options],
  
  defaults: {
    autoPosition: false,
    position: null,
    offset: new Vector(0.0, 0.0),
    animate: true,
    pointer: null,            /* "top", "left", "right", "bottom" */
    anchorTo: "top",          /* "top", "left", "right", "bottom" */
    anchor: null,
    openOnAnchorClick: true,
    visible: true
  },

  initialize: function(element, options) {
    this.setOptions(this.defaults, options);
    this.pointer = this.options.pointer;
    var size = element.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize+blur : 0));
    this.element = element;
    this.wrapper = new Element("div", {
      "class": "ss-balloon-wrapper",
      styles: {
        display: this.options.visible ? "block" : "none"
      }
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
      marginTop: pad,
      overflow: "hidden"
    });
    this.wrapper.grab(this.element.dispose());
    this.wrapper.setStyles({
      width: size.x+(2*pad),
      height: size.y+(2*pad)
    });
    this.size = size;
    this.wrapper.grab(this.balloon);
    document.body.grab(this.wrapper);
    if(this.options.animate) {
      this.showAnim = new SSFx.Morph(this.element, {
        duration: 750,
        transition: Fx.Transitions.Elastic.easeOut
      });
      this.wrapperAnim = new SSFx.Morph(this.wrapper, {
        duration: 750,
        transition: Fx.Transitions.Elastic.easeOut
      });
      this.wrapperAnim.addEvent("step", this.refresh.bind(this));
      this.hideAnim = new Fx.Morph(this.element, {
        duration: 300,
        transition: Fx.Transitions.Cubic.easeOut
      });
    }
    if(this.options.anchor) {
      this.initAnchorBehavior();
    }
    this.refresh();
  },

  tos: {
    "top": "y",
    "right": "x",
    "bottom": "y",
    "left": "x"
  },

  compl: {
    "top": "left",
    "right": "top",
    "bottom": "left",
    "left": "top"
  },

  invert: {
    "top": "bottom",
    "right": "left",
    "bottom": "top",
    "left": "right"
  },

  initAnchorBehavior: function() {
    if(!this.pointer) {
      this.pointer = this.invert[this.options.anchorTo];
    }
    this.wrapper.setStyle("position", "absolute");
    var styles = {
      position: "absolute"
    };
    styles[this.pointer] = this.options.offset[this.tos[this.pointer]];
    this.wrapper.setStyles(styles);
    if(this.options.openOnAnchorClick) {
      this.options.anchor.addEvent("click", function(evt) {
        evt = new Event(evt);
        this.show();
      }.bind(this));
    }
  },

  show: function() {
    var asize = Vector.toVector(this.options.anchor.getSize()),
        apos = Vector.toVector(this.options.anchor.getPosition()),
        size = new Vector(20, 20),
        pad = Math.max(blur, (this.pointer ? pointerSize+blur : 0)),
        rsize = size.add(new Vector(pad*2.0, pad*2.0)),
        to = this.tos[this.options.anchorTo],
        av = apos.add(asize.div(2.0)),
        bv = (asize[to+"comp"]()).add(size[to+"comp"]()).add(rsize.div(2.0)),
        loc = av.sub(bv);
    this.element.setStyles({
      width: size.x,
      height: size.y
    });
    this.wrapper.setStyle("display", "block");
    var esize = this.element.getSize();
    this.wrapper.setStyles({
      position: "absolute",
      display: "block",
      left: loc.x,
      top: loc.y,
      width: esize.x+(2.0*pad),
      height: esize.y+(2.0*pad)
    });
    this.refresh();
    var transStyles = {
      width: [20, this.size.x],
      height: [20, this.size.y]
    };
    this.showAnim.start(transStyles);
    this.wrapperAnim.start({
      left: [loc.x, loc.x-(this.size.x/2.0)],
      top: [loc.y, loc.y-this.size.y],
      width: [20, this.size.x+(pad*2.0)],
      height: [20, this.size.y+(pad*2.0)]
    });
  },

  hide: function() {
    this.hideAnim.start("opacity", 0.0);
  },

  path: function() {
    var ctxt = this.balloon.getContext("2d"),
        size = this.element.getSize(),
        canvasSize = this.wrapper.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize+blur : 0));

    ctxt.lineJoin = "round";
    ctxt.lineCap = "round";

    ctxt.moveTo(pad+radius, pad);
    ctxt.beginPath();
    /* top */
    ctxt.lineTo(pad+radius, pad);
    if(this.pointer == "top"){
      ctxt.lineTo((canvasSize.x/2.0)-(pointerSize/2.0), pad);
      ctxt.lineTo((canvasSize.x/2.0)+(pointerSize/2.0)-borderWidth, pad-pointerSize);
      ctxt.lineTo((canvasSize.x/2.0)+pointerSize, pad);
    }
    ctxt.lineTo(pad+size.x-radius, pad);      
    ctxt.arc(pad+size.x-radius, pad+radius, radius, -HalfPI, 0, false);
    /* right */
    if(this.pointer == "right"){
      ctxt.lineTo(pad+size.x, (canvasSize.y/2.0)-(pointerSize/2.0));
      ctxt.lineTo(pad+size.x+pointerSize, (canvasSize.y/2.0)+(pointerSize/2.0)-borderWidth);
      ctxt.lineTo(pad+size.x, (canvasSize.y/2.0)+pointerSize);
    }
    ctxt.lineTo(pad+size.x, pad+size.y-radius);
    ctxt.arc(pad+size.x-radius, pad+size.y-radius, radius, 0, HalfPI, false);
    /* bottom */
    if(this.pointer == "bottom"){
      ctxt.lineTo((canvasSize.x/2.0)+(pointerSize/2.0), pad+size.y);
      ctxt.lineTo((canvasSize.x/2.0)-(pointerSize/2.0)+borderWidth, pad+size.y+pointerSize);
      ctxt.lineTo((canvasSize.x/2.0)-pointerSize, pad+size.y);
    }
    ctxt.lineTo(pad+radius, pad+size.y);
    ctxt.arc(pad+radius, pad+size.y-radius, radius, HalfPI, -Math.PI, false);
    /* left */
    if(this.pointer == "left"){
      ctxt.lineTo(pad, (canvasSize.y/2.0)+(pointerSize/2.0));
      ctxt.lineTo(pad-pointerSize, (canvasSize.y/2.0)-(pointerSize/2.0)+borderWidth);
      ctxt.lineTo(pad, (canvasSize.y/2.0)-pointerSize);
    }
    ctxt.lineTo(pad, pad+radius);
    ctxt.arc(pad+radius, pad+radius, radius, -Math.PI, -HalfPI, false);
  },

  refresh: function() {
    var ctxt = this.balloon.getContext("2d"),
        size = this.element.getSize(),
        pad = Math.max(blur, (this.pointer ? pointerSize+blur : 0));

    this.balloon.set("width", size.x+(2*pad));
    this.balloon.set("height", size.y+(2*pad));
    this.balloon.setStyles({
      width: size.x+(2*pad),
      height: size.y+(2*pad)
    });

    ctxt.clearRect(0, 0, size.x+(2*pad), size.y+(2*pad));

    ctxt.save();
    ctxt.fillStyle = "rgba(79, 170, 117, 1)";
    ctxt.shadowColor = "rgba(79, 170, 117, 0.95)";
    ctxt.shadowBlur = pad;

    this.path();
    ctxt.fill();
    ctxt.restore();

    ctxt.strokeStyle = "rgba(255, 255, 255, 1)";
    ctxt.lineWidth = borderWidth;
    this.path();
    ctxt.stroke();
  },

  animate: function(styleOrProperties) {
    if(this.options.animate) this.showAnim.start(styleOrProperties);
  },

  setSize: function(x, y) {
    this.element.setStyles({
      width: x,
      height: x
    });
  }
});