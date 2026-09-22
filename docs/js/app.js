var CURSOR_ACTIVE = "fa fa-square";
var CURSOR_INACTIVE = "fa fa-square-o";

var routes = [
  { path: '/' },
  { path: '/about' },
  { path: '/experiences' }
];

var router = new VueRouter({
  mode: 'history',
  routes, // short for `routes: routes`
  scrollBehavior: function(to, from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: '#app',
  router: router,
  data: {
    cursorHovered: null
  },
  delimiters: ['${', '}'],
  mounted: function() {
    swipeEnable();
  },
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

function swipeEnable() {
  var surface = document.getElementById("wrapper");

  if (!surface) {
    return;
  }

  var activePointer = null;
  var startX = 0;
  var startY = 0;

  if (window.PointerEvent) {
    surface.addEventListener("pointerdown", function(event) {
      if (event.pointerType !== "touch" || !event.isPrimary) {
        return;
      }

      beginSwipe(event.pointerId, event.clientX, event.clientY);
    }, { passive: true });

    surface.addEventListener("pointerup", function(event) {
      if (event.pointerId === activePointer) {
        finishSwipe(event.clientX, event.clientY);
      }
    }, { passive: true });

    surface.addEventListener("pointercancel", function(event) {
      if (event.pointerId === activePointer) {
        activePointer = null;
      }
    }, { passive: true });
  } else {
    surface.addEventListener("touchstart", function(event) {
      if (event.touches.length !== 1) {
        activePointer = null;
        return;
      }

      var touch = event.touches[0];
      beginSwipe(touch.identifier, touch.clientX, touch.clientY);
    }, { passive: true });

    surface.addEventListener("touchend", function(event) {
      for (var index = 0; index < event.changedTouches.length; index++) {
        var touch = event.changedTouches[index];

        if (touch.identifier === activePointer) {
          finishSwipe(touch.clientX, touch.clientY);
          break;
        }
      }
    }, { passive: true });

    surface.addEventListener("touchcancel", function() {
      activePointer = null;
    }, { passive: true });
  }

  function beginSwipe(pointerId, clientX, clientY) {
    var edgeGutter = 32;

    if (clientX <= edgeGutter || clientX >= window.innerWidth - edgeGutter) {
      activePointer = null;
      return;
    }

    activePointer = pointerId;
    startX = clientX;
    startY = clientY;
  }

  function finishSwipe(clientX, clientY) {
    var direction = getSwipeDirection(
      clientX - startX,
      clientY - startY
    );

    activePointer = null;

    if (direction !== 0) {
      navigateBySwipe(direction);
    }
  }
}

function getSwipeDirection(deltaX, deltaY) {
  var horizontalDistance = Math.abs(deltaX);
  var verticalDistance = Math.abs(deltaY);

  if (
    horizontalDistance < 36 ||
    horizontalDistance < verticalDistance * 1.1
  ) {
    return 0;
  }

  return deltaX < 0 ? 1 : -1;
}

function navigateBySwipe(direction) {
  var paths = ["/", "/about", "/experiences"];
  var currentIndex = paths.indexOf(router.currentRoute.path);

  if (currentIndex === -1) {
    return;
  }

  var nextIndex = Math.max(0, Math.min(paths.length - 1, currentIndex + direction));

  if (nextIndex !== currentIndex) {
    router.push(paths[nextIndex]);
  }
}
