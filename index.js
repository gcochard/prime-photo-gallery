'use strict';
// albumUrl embedded like <script data-share="Y7cccQOkL9Xpq6BhXiz5xyuuvxDIjVGB693FB5RUDoL" data-album="Zl_RlStPSXuIp4i6Urs4Mg" data-blueimp="truthy -- optional" data-container="target container id" data-clip-thumb="truthy -- optional" data-cors-proxy="<cors proxy url -- defaults to crossorigin.me>" src="this-script.js"></script>
/** configuration
 *
 * required:
 * data-share: String - The shareId shown in the URL to the shared gallery
 * data-album: String - The album ID shown in the path after https://www.amazon.com/drive/v1/nodes/
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
album = scpt.getAttribute('data-album'),
share = scpt.getAttribute('data-share'),
useBlueimp = !!scpt.getAttribute('data-blueimp'),
clip = !!scpt.getAttribute('data-clip-thumb'),
container = scpt.getAttribute('data-target') || 'links',
containerId = `#${container}`,
crossOriginProxy = 'https://crossorigin.me',
amazonApi = 'https://www.amazon.com/drive/v1/nodes',
url = `${crossOriginProxy}/${amazonApi}/${album}?shareId=${share}&tempLink=true&asset=ALL&resourceVersion=V2&ContentType=JSON`,
thumb = '/alt/thumb?viewBox=250&fit=clip',
fullSize = `/alt/thumb?viewBox=${Math.min(window.screen.width, window.screen.height)}`;
$(function(){
  
  /** data looks like this:
  {
    "collectionProperties": {
      "covers": [
        {
          "id": "<photo id -- unused>",
          "isDefault": true,
          "tempLink": "<photo URL -- can be adjusted with /alt/thumb?viewBox=<size>&fit=<clip|none>>"
        },
        ...
        {
          "id": "<photo id>",
          "isDefault": true,
          "tempLink": "<photo URL>"
        }
      ]
    },
    "id": "<album id (data-album)>",
    "name": "<album name>",
    "ownerId": "<owner>",
  }
  **/
  
  $.get(url, function(data){
    // add the container if it doesn't already exist on the page
    if(!$(containerId).length){
      $('body').append(`<div id="${container}"></div>`);
    }
    const $lx = $(containerId);
    data.collectionProperties.covers.forEach(cover => {
      const ap = `<a href="${cover.tempLink+fullSize}" data-gallery="#blueimp-gallery"><img src="${cover.tempLink+thumb}"></a>&nbsp;`;
      $lx.append($(ap));
    });
  
    if(useBlueimp){
      $(containerId).on('click', event => {
        event = event || window.event;
        const target = event.target || event.srcElement,
          link = target.src ? target.parentNode : target,
          options = {index: link, event: event},
          links = $(containerId).find('a');
        blueimp.Gallery(links, options);
      });
    }
  
  });
});
