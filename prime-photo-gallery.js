'use strict';
// albumUrl embedded like <script data-share="Y7cccQOkL9Xpq6BhXiz5xyuuvxDIjVGB693FB5RUDoL" data-blueimp="truthy -- optional" data-container="target container id" data-clip-thumb="truthy -- optional" data-cors-proxy="<cors proxy url -- defaults to crossorigin.me>" src="this-script.js"></script>
/** configuration
 *
 * required:
 * data-share: String - The shareId shown in the URL to the shared gallery
 *
 * optional:
 * data-blueimp: Boolean - Whether to use blueimp-gallery tto display the full-size images in a lightbox format.
 * You must include blueimp yourself on the page.
 * data-container: String - The target container ID for your images. If it does not exist on the page, it will be created.
 * data-clip-thumb: Boolean - Whether to clip the thumbnails on the page, or display them resized instead.
 * data-cors-proxy: String - An alternative cors proxy server to crossorigin.me
 * data-sort-property: String - String - Can be `contentProperties.contentDate` (default) or one of [`createdDate`, `modifiedDate`, `name`]
 * data-sort-direction: String - Can be `ASC` (default) or `DESC`
 * Warning: This requires fetch or a polyfill.
 *
*/
const d = document,
a = 'appendChild',
s = d.currentScript,
e = 'data-',
g = s.getAttribute,
h = s.hasAttribute,
c = d.createElement,
sa = 'setAttribute',
share = g(e+'share'),
b = e+'blueimp',
blueimp = h(b)?(g(b)||'#blueimp-gallery'):false,
clip = h(e+'clip-thumb')?'&fit=clip':'',
container = g(e+'target') || 'links',
corsProxy = g(e+'cors-proxy') || 'https://crossorigin.me',
amazonNodeApi = 'https://www.amazon.com/drive/v1/nodes',
amazonShareApi = 'https://www.amazon.com/drive/v1/shares',
shareUrl = `${corsProxy}/${amazonShareApi}/${share}?id=${share}&resourceVersion=V2&ContentType=JSON`,
thumb = `/alt/thumb?viewBox=250${clip}`,
fullSize = `/alt/thumb?viewBox=${Math.min(window.screen.width, window.screen.height)}`,
sortDirection = g(e+'sort-direction') || 'ASC',
sortProperty = g(e+'sort-property') || 'contentProperties.contentDate',
sort = `%5B%27${sortProperty}+${sortDirection}%27%5D`,
useFetch = h(e+'use-fetch'),
g = () => {

  // add the container if it doesn't already exist on the page
  var containerDiv = d.getElementById(container);
  if(!containerDiv){
    containerDiv = c('div');
    containerDiv.id = container;
    d.body[a](containerDiv);
  }
  const cont = containerDiv;

  if(useFetch && fetch){
    var oldget = $.get;
    $.get = function(url, cb, tries){
      tries = tries || 0;
      fetch(url).then(response => {
        if(response.ok){
          return response.json();
        } else {
          // stop retrying after 10 tries
          if(tries > 10){
            return cb({data:[]});
          }
          return setTimeout(function(){
            $.get(url, cb, tries+1);
          }, 1000);
        }
      }).then(data => {
        return cb(data);
      });
    };
  }

  if(blueimp){
    cont.addEventListener('click', event => {
      event = event || window.event;
      const target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = cont.querySelectorAll('a');
      blueimp.Gallery(links, options);
    });
  }

  function walkDescendants(node){
    const object = node.id,
    childrenUrl = `${corsProxy}/${amazonNodeApi}/${object}/children?asset=ALL&tempLink=true&sort=${sort}&shareId=${share}&searchOnFamily=true&offset=0&resourceVersion=V2&ContentType=JSON`;
    $.get(childrenUrl, function(data){
      data.data.forEach(node => {
        if(node.tempLink){
          const apNode = c('a');
          apNode[sa]('href',node.tempLink+fullSize);
          apNode[sa](e+'gallery',blueimp);
          const imgNode = c('img');
          imgNode[sa]('src',node.tempLink+thumb);
          apNode[a](imgNode);
          cont[a](apNode);
        } else if(node.collectionProperties) {
          walkDescendants(node);
        }
      });
    });
  }

  $.get(shareUrl, function(shareInfo){
    walkDescendants(shareInfo.nodeInfo);
  });
};
d.onreadystatechange = j => {
  if(d.readyState=='complete'){g();}
}
