# prime-photo-gallery
An amazon prime photo gallery embed on your site

Usage:

- Install it with npm `npm install prime-photo-gallery` and bundle it with your distribution *OR*
- embed it with unpkg.com `https://unpkg.com/prime-photo-gallery/prime-photo-gallery.min.js`.

When it's on your page, you can configure it with the following `data-attributes`:

- Required:
  - `data-share`: String - The `shareId` shown in the URL e.g. `/share/<share id>`
- Optional:
  - `data-blueimp`: Boolean - Whether to use [`blueimp-gallery`](https://github.com/blueimp/Gallery) to display the full-size images in a lightbox format.
    - You must include `blueimp-gallery` yourself on the page.
  - `data-container`: String - The target container ID for your images. If it does not exist on the page, it will be created.
  - `data-clip-thumb`: Boolean - Whether to clip the thumbnails on the page, or display them resized instead.
  - `data-cors-proxy`: String - An alternative cors proxy server to crossorigin.me

Warning: This requires jQuery or a jQuery-compatible library such as Zepto.
It uses the get API, ID selectors, click events, dom insertion, and dom element creation.


Example usage:

```html
<!-- this example includes blueimp-gallery -->
<html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.21.3/css/blueimp-gallery.min.css">
  </head>
  <body>
    <div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls" data-continuous="true" data-toggle-controls-on-return="true" data-toggle-slideshow-on-space="true" data-enable-keyboard-navigation="true" data-close-on-escape="true" data-close-on-slide-click="true">
      <div class="slides"></div>
      <h3 class="title"></h3>
      <a class="prev">‹</a>
      <a class="next">›</a>
      <a class="close">×</a>
      <a class="play-pause"></a>
      <ol class="indicator"></ol>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js"></script>
    <!-- given a share url formatted as follows: https://www.amazon.com/clouddrive/share/Y7cccQOkL9Xpq6BhXiz5xyuuvxDIjVGB693FB5RUDoL/album/Zl_RlStPSXuIp4i6Urs4Mg?_encoding=UTF8&*Version*=1&*entries*=0&mgh=1 
                                                                                         ^          this is the share ID           ^
    given a share url formatted as follows: https://www.amazon.com/photos/share/Y7cccQOkL9Xpq6BhXiz5xyuuvxDIjVGB693FB5RUDoL
                                                                                ^          this is the share ID           ^
            data-share is the share ID as seen above -->
    <script data-share="Y7cccQOkL9Xpq6BhXiz5xyuuvxDIjVGB693FB5RUDoL" data-blueimp="true" data-container="pics" src="https://unpkg.com/prime-photo-gallery/prime-photo-gallery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/blueimp-gallery/2.21.3/js/blueimp-gallery.min.js"></script>
  </body>
</html>

```
