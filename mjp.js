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
    halfway = innerHeight/3;
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

  const animate = () => {
    window.requestAnimationFrame(animate);
    let scrollTop = document.body.scrollTop;
    let viewbot = innerHeight + scrollTop;
    let viewmid = scrollTop + halfway;
    let midheight = innerHeight - halfway;
    // move all the animations
    animations.forEach(an => {
      // only bother with the visible elements
      if (an.top < viewbot) {
        an.ele.setAttribute('visibility','true');
        let steps = (an.header.rect.width + an.header.rect.left)  / midheight * 1.75;
        let left = Math.min(steps * (viewmid - an.top), 0);
        an.header.ele.style.left = left;
        let opacity = (an.header.rect.width + left)/ an.header.rect.width;
        an.header.ele.style.opacity = opacity;
        // slide content up
        steps = (an.content.rect.height + an.content.rect.top)  / midheight;
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

  initialize();
  animate();

})(window, document);