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
  const articles = document.querySelectorAll('main > article');

  var animations, halfway, innerHeight;


  const initialize = () => {
    innerHeight = window.innerHeight;
    halfway = innerHeight/2;
    animations = [];
    // initialize article animations
    articles.forEach(art => {
      art.style.height = art.clientHeight;
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
  }


  const updateArticles = () => {
    filter(articles, isVisible).forEach(art => {
      console.log('visible', art);
      art.setAttribute('visibility','true');
    });
  };

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
  }

  initialize();
  animate();

})(window, document);