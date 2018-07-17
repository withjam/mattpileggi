function modal(url) {
  var div = document.createElement('div');
  div.id = 'OOo.modal';
  div.style.position = 'fixed';
  div.style.zIndex = 5000;
  div.style.top = 0;
  div.style.left = 0;
  div.style.right = 0;
  div.style.bottom = 0;
  div.style.overflow = 'auto';
  div.style.backgroundColor = 'rgba(0,0,0,0.75)';

  var ifr = document.createElement('iframe');
  div.appendChild(ifr);

  ifr.style.position = 'absolute';
  ifr.setAttribute('border', 'none');
  ifr.setAttribute('frameBorder', 'none');
  ifr.style.border = 'solid 1px #333';
  ifr.style.width = Math.max(window.innerWidth / 1.75, 550);
  ifr.style.height = Math.max(window.innerHeight / 1.75, 450);
  ifr.style.left = window.innerWidth/2 - parseInt(ifr.style.width)/ 2;
  ifr.style.top = window.innerHeight/2 - parseInt(ifr.style.height) / 2;

  ifr.src = url;
  var ifrLoad = function() {
    ifr.contentWindow.onbeforeunload = function() {
      console.log('unloaded');
    }
  };
  if (ifr.addEventListener) {
    ifr.addEventListener('load', ifrLoad, false);
    ifr.addEventListener('unload', function() { console.log('onunload'); }, false);
  }

  document.body.appendChild(div);
}


function OOo_popover(url,target, params) {
  console.log('popover', url);
  //var w = window.open(url, target || Date.now(), params || 'scrollbars=yes, resizable=yes, top=400, left=550, width=550, height=450');
}


//'https://secure.opinionlab.com/ccc01/o.asp?id=QILWEjUd'