
function insertHtml(html) {
  const currentScript = document.currentScript;
  if (currentScript) {
    currentScript.insertAdjacentHTML('beforebegin', html);
  } else {
    document.body.insertAdjacentHTML('beforeend', html);
  }
}
insertHtml('</div>')
insertHtml('    <footer class="footer">')
insertHtml('        <div class="footer-line">Powered By <a href="https://github.com/arbeiterklassen/Soyorin-Work" target="_blank">Soyorin.Work - '+"AKlassen's Blogs</a> 浙ICP备1145141919810号• © 2022</div>")
insertHtml('    </footer>')
insertHtml('    <script type="text/javascript" src="../js/jquery-3.4.1.min.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/sweetalert.min.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/pace.min.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/base.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/d-audio.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/myPagination.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/vditor.min.js"></script>')
insertHtml('    <script type="text/javascript" src="../js/article-detail.js"></script>')
insertHtml('    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"></script>')
insertHtml('    <script src="https://cdn.staticfile.org/layer/3.1.1/layer.js"></script>')
insertHtml('    <script>document.body.oncopy = function() {layer.msg("复制成功,若要转载请务必保留原文链接<br>并遵守 (CC)-BY-NC-SA 协议");};</script>')
insertHtml('    <script type="text/x-mathjax-config">')
insertHtml('    MathJax.Hub.Config({')
insertHtml('        showProcessingMessages: false, //关闭js加载过程信息')
insertHtml('        messageStyle: "none", //不显示信息')
insertHtml('        extensions: ["tex2jax.js"],')
insertHtml('        jax: ["input/TeX", "output/HTML-CSS"],')
insertHtml('        tex2jax: {')
insertHtml('            inlineMath:  [ ["$", "$"] ], //行内公式选择$')
insertHtml('            displayMath: [ ["$$","$$"] ], //段内公式选择$$')
insertHtml('            skipTags: ["script", "noscript", "style", "textarea", "pre","code"","a"], //避开某些标签')
insertHtml('            ignoreClass:"comment-content" //避开含该Class的标签')
insertHtml('        },')
insertHtml('        "HTML-CSS": {')
insertHtml('            availableFonts: ["STIX","TeX"], //可选字体')
insertHtml('            showMathMenu: false //关闭右击菜单显示')
insertHtml('        }')
insertHtml('    });')
insertHtml('    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);')
insertHtml('    </script>')
insertHtml('    <script type="text/javascript" defer>')
insertHtml('    //图片懒加载')
insertHtml('    onst lazyImage = new LazyImage(".lazy-image");')
insertHtml('    </script>')