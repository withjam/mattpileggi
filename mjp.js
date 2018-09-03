(function(window, document) {

  const filter = (arr, comp) => {
    let matches = [];
    arr.forEach(item => {
      if (comp.call(this, item)) {
        matches.push(item);
      }
    });
    return matches;
  }

  const isVisible = ele => {
    let rect = ele.getBoundingClientRect();
    let viewbot = window.innerHeight + document.body.scrollTop;
    let visible = viewbot > rect.top; // care only about it coming in from the bottom
    return visible;
  };

  // first we need to identify and calculate all of the articles
  const articles = document.querySelectorAll('main > section');
  const parallaxes = document.querySelectorAll('.parallax');
  var animations, halfway, innerHeight, paralax;

  const initialize = () => {
    innerHeight = window.innerHeight;
    halfway = innerHeight/3.5;
    animations = [];
    // initialize article animations
    articles.forEach(art => {
      //art.style.height = art.clientHeight;
      let rect = art.getBoundingClientRect();
      let header = art.querySelector('header');
      let content = art.querySelector('.content');
      let animation = {
        ele: art,
        top: rect.top + document.body.scrollTop,
        height: rect.height,
        header: {
          ele: header,
          rect: header.getBoundingClientRect()
        },
        content: {
          ele: content,
          rect: content.getBoundingClientRect()
        }
      };

      console.log('initialize rect', rect, animation);

      animations.push(animation);

    });

    parallaxes.forEach(div => {
      let div_h = div.clientHeight/2;
      div.parallax_slides = div.querySelectorAll('.parallax-slides > img');
    });
  }

  var i = 0, last_scroll = 0;
  const animate = () => {
    window.requestAnimationFrame(animate);
    let scrollTop = document.body.scrollTop;
    let scrollDiff = scrollTop - last_scroll;
    last_scroll = scrollTop;
    if (scrollTop && Math.abs(scrollDiff) < 2) return; // keep it smooth, no jitters
    let viewbot = innerHeight + scrollTop;
    let viewmid = scrollTop + halfway;
    let midheight = innerHeight - halfway;
    // move all the animations
    animations.forEach(an => {
      // only bother with the visible elements
      if (an.top < viewbot) {
        an.ele.setAttribute('visibility','true');
        let steps = an.header.rect.width  / midheight * 1.75;
        let left = Math.min(steps * (viewmid - an.top), 0);
        an.header.ele.style.left = left;
        let opacity = (an.header.rect.width + left)/ an.header.rect.width;
        an.header.ele.style.opacity = opacity;
        // slide content up
        steps = an.content.rect.height  / midheight;
        //console.log('sliding up, steps: %d, viewmid: %d, an.top: %d', steps, viewmid, an.top);
        an.content.ele.style.top = -Math.min(steps * (viewmid - an.top), 0);
        an.content.ele.style.opacity = opacity;
      }
    });

    // animate parallax
    parallaxes.forEach(div => {
      const rect = div.getBoundingClientRect();
      const offsetY = halfway - rect.top + rect.height/2;
      div.parallax_slides.forEach(img => {
        let axis = img.getAttribute('data-axis');
        let invert = img.hasAttribute('data-invert');
        let change = offsetY * parseFloat(img.getAttribute('data-coeffecient') || 0.1);
        if (invert) change = change * -1;
        // TODO: make the change a percentage and apply it the overall height of the area
        if (!axis || axis !== 'x') {
          img.style.top = invert ? change + img.clientHeight/2 : change - img.clientHeight/2;
        } else {
          img.style.left = invert ? change + img.clientWidth/2 : change - img.clientWidth/2;
        }
      })
    });
  }

  function xhrLoadHandler(success, failure) {
    console.log('returning xhrLoadHandler');
    return function() {
      console.log('xhr loaded', this.status);
      try {
        if (this.status && this.status === 200) {
          success.call(this, this.responseText, this);
        } else if (failure) {
          failure.call(this, this.status, this)   
        }
      } catch(ex) {
        console.log('error handling XHR response', ex);
      }
    }
  }

  function get(url, cb) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', xhrLoadHandler(cb));
    xhr.open('GET', url);
    xhr.send();
  }

  function showAsModal(url) {
    modal = document.getElementById('modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal';
      modal.innerHTML = '<div id="modal_container"><header class="modal_header">Modal</header><article class="modal_content"></article></div>';
      document.querySelector('main').appendChild(modal);
      modal.addEventListener('click', handleModalClick);  
    }
    get(url, (data) => {
      // get only what is within main
      var frag = document.createDocumentFragment();
      var dummy = document.createElement('div');
      dummy.id = 'dummy';
      dummy.innerHTML = data;
      frag.appendChild(dummy);
      modal.querySelector('.modal_content').innerHTML = frag.querySelector('main').innerHTML;
      modal.className = 'open';
    });
  }

  function handleModalClick(ev) {
    var target = ev.target;
    console.log('modal click', target);
    var close = document.getElementById('modal_close');
    var overlay = document.getElementById('modal');
    if (target === close || target === overlay) {
      console.log('closing');
      var modal = document.getElementById('modal');
      if(modal) {
        modal.className = 'closed';
      }
    }
  }

  function linkAsModal(e) {
    var paths = e.path.length, a = e.path[0];
    while(paths-- && a.tagName !== 'A') {
      a = e.path[paths];
    }
    if (a) {
      var url = a.getAttribute('href');
      console.log('link as modal', url, a);
      if (url) {
        showAsModal(url);
        e.preventDefault();
        e.cancelBubble = true;
        return false;
      }
    }
  }

  // attach to all the project links
  var project_links = document.querySelectorAll('#projects a[target]');
  project_links.forEach((l) => {
    l.addEventListener('click', linkAsModal);
  });

  initialize();
  animate();

})(window, document);