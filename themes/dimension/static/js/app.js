var CURSOR_ACTIVE = "fa fa-square";
var CURSOR_INACTIVE = "fa fa-square-o";

var routes = [
  { path: '/' },
  { path: '/about' },
  { path: '/experiences' }
];

var router = new VueRouter({
  mode: 'history',
  routes // short for `routes: routes`
});

var app = new Vue({
  el: '#app',
  router: router,
  data: {
    cursorHovered: null
  },
  delimiters: ['${', '}'],
  mounted: function() {
    fixScrollOverflow();
    swipeEnable();
  },
  updated: fixScrollOverflow,
  methods: {
    getCursorShape: function(dot) {

      var url = this.$route.path;

      console.log(url);

      if (dot === this.cursorHovered) {
        return CURSOR_ACTIVE;
      }

      if(url === "/" && dot === 0) {
        return CURSOR_ACTIVE;
      } else if(url === "/about" && dot === 1) {
        return CURSOR_ACTIVE;
      } else if(url === "/experiences" && dot === 2) {
        return CURSOR_ACTIVE;
      } else {
        return CURSOR_INACTIVE;
      }

    },

    hoverCursor: function(dot) {
      this.cursorHovered = dot;
    },

    leaveCursor: function() {
      this.cursorHovered = null;
    },

    showHome: function() {
      return this.$route.path === "/";
    },

    showAbout: function() {
      return this.$route.path === "/about";
    },

    showExperiences: function() {
      return this.$route.path === "/experiences";
    },

    getType: function() {
      if(this.$route.path === "/") {
        return "type-home";
      } else {
        return "type-pages";
      }
    },

    getBox: function() {
      if (this.getType() == "type-pages") {
        return "box";
      } else {
        return "";
      }
    }

  }
});

//temp TODO way to keep fullscreen hero image
function fixScrollOverflow() {
  var body = document.body;
  var wrapper = document.getElementById("wrapper");
  var url = window.location.pathname;

  var scrollVisible = $(document).height() > $(window).height();

  if (url === "/" && scrollVisible) {
    body.style.overflow = "hidden";
    wrapper.style.transform = "translateY(-5%)";  //fix
  } else {
    body.style.overflow = "auto";
    wrapper.style.transform = "none";
  }

};

function swipeEnable() {
  var navigation = document.getElementById("site");

  if (!navigation) {
    return;
  }

  var hammertime = new Hammer(navigation, {});
  hammertime.get("swipe").set({ direction: Hammer.DIRECTION_HORIZONTAL });
  var sitemapIndex = 0;

  hammertime.on("swipeleft", function(ev) {
    if (sitemapIndex < 2) {
      sitemapIndex++;
    }
    $(".dot-"+sitemapIndex).trigger("click");
  });

  hammertime.on("swiperight", function() {
    if (sitemapIndex > 0) {
      sitemapIndex--;
    }
    $(".dot-"+sitemapIndex).trigger("click");
  })
}
