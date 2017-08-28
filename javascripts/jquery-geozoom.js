(function($) {
  $.fn.geozoom = function(options) {
    var opts = $.extend({}, $.fn.geozoom.defaults, options);

    return this.each(function() {
      var $this = $(this);

      var o = $.extend({}, opts, $this.data());

      $this.height(o.height);
      $this.width(o.width);
      $this.addClass("geozoom");

      var markup = $.fn.geozoom.formatHtml(o);
      $this.html(markup);

      $this.find('ul.images li:gt(0)').css('opacity','0');
      $this.find('.label').hide();

      $('.zone', $this).mouseenter(function (e) {
        var $zone = $(e.currentTarget);
        var index = $zone.closest('.zones').find('.level').index($zone) + 1;
        var $image = $(this).closest('.geozoom').find('ul.images li').eq(index);
        $image.stop().animate({opacity:1}, 250);
      });

      $('.zone', $this).mouseleave(function (e) {
        var $zone = $(e.currentTarget);
        var index = $zone.closest('.zones').find('.level').index($zone) + 1;
        var $image = $(this).closest('.geozoom').find('ul.images li').eq(index);
        $image.stop().animate({opacity:0}, 250);
      });

      $this.find('.point').mouseenter(function (e) {
        $(this).closest(".geozoom").find(".label").show();
      });

      $this.find('.point').mouseleave(function (e) {
        $(this).closest(".geozoom").find(".label").hide();
      });

      $this.find('.point').css({
        'background-image' : 'url('+o.pin+')',
        'height' : o['pin-height'],
        'width' : o['pin-width'],
        'margin-top' : -o['pin-height'],
        'margin-left' : -(o['pin-width'] / 2)
      });
    });
  };

  $.fn.geozoom.formatHtml = function(o) {
    var html = "<ul class='images'>\n\
      <li><img src='"+$.fn.geozoom.gImgUrl(o.width,o.height,o.address,o.zstart,o.maptype)+"' /></li>\
      <li><img src='"+$.fn.geozoom.gImgUrl(o.width,o.height,o.address,o.zmiddle,o.maptype)+"' /></li>\
      <li><img src='"+$.fn.geozoom.gImgUrl(o.width,o.height,o.address,o.zend,o.maptype)+"' /></li>\
      </ul>\
      <div class='zones'>\
        <div class='zone level catcher'>\
          <div class='zone level inner'>\
            <div class='point'>\
      </div></div></div></div>";
    if (o.label) html += "<div class='label'><span>"+o.address+"</span></div>";
    return html;
  };

  $.fn.geozoom.gImgUrl = function (width, height, address, zoom, maptype) {
    var base = 'http://maps.google.com/maps/api/staticmap?';
    var size = { height: height, width: width };
    size = $.fn.geozoom.aspectFit(size);
    var opts = {
      size: size.width + 'x' + size.height,
      zoom: zoom,
      center: address,
      maptype: maptype,
      sensor: 'true'
    };
    var query = [];
    $.each(opts, function(key, value) { query.push(key + '=' + value); });
    return base + query.join('&');
  };

  $.fn.geozoom.aspectFit = function(size, canvas) {
    canvas = canvas || { height: 640, width: 640 };
    if (size.height <= canvas.height && size.width <= canvas.width) return size;
    var majorAxis = 'width';
    if (size.height >= size.width) {
      majorAxis = 'height';
    }
    var minorAxis = (majorAxis === 'width' ? 'height' : 'width');
    var coef = canvas[majorAxis] / size[majorAxis];
    return { height: Math.round(size.height * coef),
             width: Math.round(size.width * coef) };
  };

  $.fn.geozoom.defaults = {
    height: 512,
    width: 512,
    address: 'New York, NY',
    maptype: 'hybrid',
    zstart: 2,
    zmiddle: 5,
    zend: 10,
    label: true,
    pin: 'images/jquery-geozoom-pin.png',
    'pin-height': 24,
    'pin-width': 19
  };
})(jQuery);

