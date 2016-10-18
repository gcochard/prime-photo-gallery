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
 *
 * Warning: This requires jquery or a jquery-compatible library such as zepto.
 * It uses the get API, ID selectors, click events, dom insertion, and dom element creation.
 *
*/
const scpt = document.currentScript,
share = scpt.getAttribute('data-share'),
useBlueimp = !!scpt.getAttribute('data-blueimp'),
clip = (!!scpt.getAttribute('data-clip-thumb'))?'&fit=clip':'',
container = scpt.getAttribute('data-target') || 'links',
containerId = `#${container}`,
crossOriginProxy = 'https://crossorigin.me',
amazonNodeApi = 'https://www.amazon.com/drive/v1/nodes',
amazonShareApi = 'https://www.amazon.com/drive/v1/shares',
shareUrl = `${crossOriginProxy}/${amazonShareApi}/${share}?id=${share}&resourceVersion=V2&ContentType=JSON`,
thumb = `/alt/thumb?viewBox=250${clip}`,
fullSize = `/alt/thumb?viewBox=${Math.min(window.screen.width, window.screen.height)}`;
$(function(){

  // add the container if it doesn't already exist on the page
  if(!$(containerId).length){
    $('body').append(`<div id="${container}"></div>`);
  }
  const $cont = $(containerId);

  $.get(shareUrl, function(shareInfo){
    const album = shareInfo.nodeInfo.id,
    childrenUrl = `${crossOriginProxy}/${amazonNodeApi}/${album}/children?asset=ALL&shareId=${share}&tempLink=true&limit=1&searchOnFamily=true&offset=0&asset=ALL&resourceVersion=V2&ContentType=JSON`;
    $.get(childrenUrl, function(data){
      if(!data.count){
        // bail, no albums found
        $cont.append('Error, no albums found');
        return;
      }
      data.data.forEach(node => {
        node.collectionProperties.covers.forEach(cover => {
          const ap = `<a href="${cover.tempLink+fullSize}" data-gallery="#blueimp-gallery"><img src="${cover.tempLink+thumb}"></a>&nbsp;`;
          $cont.append($(ap));
        });
      });
    
      if(useBlueimp){
        $cont.on('click', event => {
          event = event || window.event;
          const target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = $cont.find('a');
          blueimp.Gallery(links, options);
        });
      }
    
    });
  });
});
