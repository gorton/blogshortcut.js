/*
* blogshortcut.js
* version 1.1
*
* copryright 2011 gorton
* http://gorton.jp/
*
* Include jQuery.ready function
* http://jquery.com/
*/
(function(){
    var document = window.document;
    var gg = {
        config:{
            dynamic: {
                combo     : ['g'],       // Key Combo First
                home      : ['h'],       // key home
                top       : ['i'],       // key pagetop
                up        : ['k'],       // key up
                down      : ['j'],       // key down
                next      : ['h'],       // key next
                prev      : ['l'],       // key prev
                sid       : ['s'],       // searchbox id
                postclass : ['post'],    // post class name
                rel_home  : ['home'],    // rel=home
                rel_next  : ['next'],    // rel=next
                rel_prev  : ['prev'],    // rel=prev
                rel_post  : ['bookmark'] // rel=bookmark
            },
            static:{
                dialogContainerId: 'ggshortcut-dialog-container',
                dialogId: 'ggshortcut-dialog',
                reg1: /blogshortcut\.js.+/,
                reg2: /^blogshortcut\.js\#/,
                reg3: 'blogshortcut\.js\#'
            }
        },
        overrideKey: function(){
            var reg = gg.config.static.reg1, s = [];
            var script = document.getElementsByTagName('script');
            for(var i=0, len=script.length; i<len; i++) {
                if( reg.exec( script[i].src ) ){
                    s = reg.exec( script[i].src );
                    break;
                }
            }
            if(!s[0] || !s[0].match(gg.config.static.reg2) ) return;
            s = s[0].replace(gg.config.static.reg3, '');
            if(!s) return;
            s = s.split('&');
            for(var i in s){
                var p = s[i].split('=');
                var h = p[1].split(',');
                gg.config.dynamic[p[0]] = h;
            }
            return;
        },
        count:false,
        glb_post:false,
        interval: '',
        offsetTop: 0,
        isHelp: false,
        isCombo: false,
        isReady: false,
        isInput: function(e){
            if(!e) return false;
            var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
            var name = node.nodeName;
            if(node && (name == 'INPUT' || name == 'SELECT' || name == 'TEXTAREA')) {return name;}
            else { return false; }
        },
        focusSearchBox: function(e){
            gg.cancel(e);
            var input = document.getElementById(gg.config.dynamic.sid[0]);
            input.focus();
        },
        blur: function(e){
            gg.cancel(e);
            var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
            node.blur();
        },
        scroller: function(direction){
            clearInterval(gg.interval);
            var position, post, posts = gg.getElementsByClass(gg.config.dynamic.postclass[0]);
            if(!posts || !posts.length) return;
            var poslen = posts.length;
            if(direction == 'down') {
                if(gg.count === false) { gg.count = 0; }
                else { gg.count++; }
                if(gg.count >= poslen - 1) { gg.count = poslen - 1; }
                position = gg.getElementPosition( posts[gg.count] );
            } else if(direction == 'up') {
                if(gg.count === false) return;
                gg.count--;
                if(gg.count < 0) gg.count = 0;
                position = gg.getElementPosition( posts[gg.count] );
            }
            if(!position) return;
            window.scrollTo(0, position.y);
            gg.glb_post = posts[gg.count];
        },
        scroll: function(d){
            var speed = 10;
            var i = window.innerHeight || document.documentElement.clientHeight;
            var h = document.body.scrollHeight;
            var a = gg.currentScroller();
            if (d > a) {
                if (h-d > i) {
                    a += Math.ceil((d - a) / speed);
                } else {
                    a += Math.ceil((d - a - (h - d)) / speed);
                }
            } else {
                a = a + (d - a) / speed;
            }
            window.scrollTo(0, a);
            if (a == d || gg.offsetTop == a) clearInterval(gg.interval);
            gg.offsetTop = a;
        },
        currentScroller: function(){
            var b = document.body, d = document.documentElement;
            if (b && b.scrollTop) return b.scrollTop;
            if (d && d.scrollTop) return d.scrollTop;
            if (window.pageYOffset) return window.pageYOffset;
            return 0;
        },
        cancel: function(e){
            clearInterval(gg.interval);
            if(e.preventDefault) { e.preventDefault(); return; }
            else { e.returnValue = false; return; } // for ie event stop
        },
        transport: function(where){
            var a = document.getElementsByTagName('a');
            if(!a) return;
            for(var i=0, len=a.length; i<len; i++) {
                if(a[i].rel == where) {
                    location.href = a[i].href;
                    break;
                }
            }
            return;
        },
        help: function(){
            gg.rmhelp();
            var dh = document.body.scrollHeight || document.documentElement.scrollHeight;
            var ww = window.innerWidth || (document.documentElement && document.documentElement.clientWidth);
            var wh = window.innerHeight || (document.documentElement && document.documentElement.clientHeight);
            var container = document.createElement('div');
            container.setAttribute('id', gg.config.static.dialogContainerId);
            container.style.position = 'fixed';
            container.style.width = '100%';
            container.style.height = dh + 'px';
            container.style.zIndex = 9999;
            container.style.top = 0, container.style.left = 0;
            var em_style = 'font-weight:bold;font-style:normal;font-size:11px;', span_style = 'font-style:normal;font-size:11px;';
            var c = [];
            c.push('<div id="ggshortcut-dialog" style="position:absolute;width:300px;background:#000000;border-radius:10px;-webkit-border-radius:10px;-moz-border-radius:10px;color:#fff;">');
            c.push('<h3 style="margin:0;padding:5px 10px;font-weight:bold;font-size:14px;">Keyboard Shortcuts</h3><div class="help" style="padding:5px 10px;overflow:hidden;_zoom:1;">');
            c.push('<div class="unit" style="width:49%;float:left;"><em style="' + em_style + '">' + gg.config.dynamic.combo[0] + '-' + gg.config.dynamic.home[0] + '</em>');
            c.push('<span style="' + span_style + '"> : home</span><br>');
            c.push('<em style="' + em_style + '">' + gg.config.dynamic.combo[0] + '-' + gg.config.dynamic.top[0] + '</em>');
            c.push('<span style="' + span_style + '"> : page top</span><br>');
            c.push('<em style="' + em_style + '">?</em><span style="' + span_style + '"> : help</span><br>');
            c.push('<em style="' + em_style + '">/</em><span style="' + span_style + '"> : search</span><br></div>');
            c.push('<div class="unit" style="width:49%;float:right;"><em style="' + em_style + '">' + gg.config.dynamic.up[0] + '</em>');
            c.push('<span style="' + span_style + '"> : up</span><br>');
            c.push('<em style="' + em_style + '">' + gg.config.dynamic.down[0] + '</em>');
            c.push('<span style="' + span_style + '"> : down</span><br>');
            c.push('<em style="' + em_style + '">' + gg.config.dynamic.next[0] + '</em>');
            c.push('<span style="' + span_style + '"> : next</span><br>');
            c.push('<em style="' + em_style + '">' + gg.config.dynamic.prev[0] + '</em>');
            c.push('<span style="' + span_style + '"> : prev</span></div>');
            c.push('<div class="copy" style="clear:both;text-align:right;font-size:11px;padding:5px 0 0;color:#fff;">blogshortcut by <a style="color:#fff;" href="http://gorton.jp/" target="_blank">gorton</a></div>');
            c.push('</div></div>');
            c = c.join('');
            container.innerHTML = c;
            var b = document.getElementsByTagName('body');
            b[0].appendChild(container);
            var dialog = document.getElementById(gg.config.static.dialogId),
            current = gg.currentScroller();
            dialogW = dialog.offsetWidth || dialog.style.pixelWidth,
            dialogH = dialog.offsetHeight || dialog.style.pixelHeight,
            dialogLeft = Math.floor( (ww - dialogW) / 2 ),
            dialogTop = Math.floor( (wh - dialogH) / 2 );
            dialog.style.left = dialogLeft + 'px';
            dialog.style.top = dialogTop + 'px';
            dialog.style.filter = 'alpha(opacity=90)';
            dialog.style.MozOpacity = 0.9;
            dialog.style.opacity = 0.9;
        },
        rmhelp: function(){
            gg.removeElementById(gg.config.static.dialogContainerId);
        },
        removeElementById: function(id){
            id = document.getElementById(id);
            if(!id) return;
            var par = id.parentNode;
            par.removeChild(id);
            return;
        },
        getPermalink: function(obj){
            if(!obj) return;
            var a = obj.getElementsByTagName('a'), ra;
            if(!a || !a.length) return;
            for(var i=0, j=0, len=a.length; i<len; i++) {
                if(a[i].rel == gg.config.dynamic.rel_post[0]) {
                    ra = a[i];
                    break;
                }
            }
            if(!ra) return;
            location.href = ra.href;
        },
        getElementsByClass: function(className){
            var classElements = [], klass = [];
            if(document.all) {
                var allElements = document.all;
            } else if(document.getElementsByTagName) {
                var allElements = document.getElementsByTagName("*");
            }
            if(!allElements || !allElements.length) return classElements;
            for(var i=0, j=0, len=allElements.length; i<len; i++) {
                klass = allElements[i].className.split(' ');
                for(var x=0, xlen=klass.length; x<xlen; x++){
                    if(klass[x] == className) {
                        classElements[j] = allElements[i];
                        j++;
                        break;
                    }
                }
            }
            return classElements;
        },
        getElementPosition: function(e){
            var p = {x:0, y:0};
            if(!e) return p;
            p.x = e.offsetLeft, p.y = e.offsetTop;
            if(e.offsetParent) while (e = e.offsetParent) p.x += e.offsetLeft, p.y += e.offsetTop;
            return p;
        }
    };
    // from jQuery ready function
    gg.ready = (function(){
        var ready_event_listener = function(fn) {
            var idempotent_fn = function(){
                if(gg.isReady) return;
                gg.isReady = true;
                return fn();
            };
            // The DOM Ready check for IE
            var doScrollCheck = function(){
                if(gg.isReady) return;
                // IE trick
                try{
                    document.documentElement.doScroll('left');
                }catch(e){
                    setTimeout(doScrollCheck, 1);
                    return;
                }
                // Execute any waiting function
                return idempotent_fn();
            };
            // If browser ready event has already occured
            if(document.readyState === 'complete') {
                return idempotent_fn();
            }
            if(document.addEventListener){
                document.addEventListener('DOMContentLoaded', idempotent_fn, false);
                window.addEventListener('load', idempotent_fn, false);
            } else if (document.attachEvent) {
                document.attachEvent('onreadystatechange', idempotent_fn);
                window.attachEvent('onload', idempotent_fn);
                var toplevel = false;
                try {
                    toplevel = window.frameElement == null;
                } catch(e) {}
                if(document.documentElement.doScroll && toplevel) {
                    return doScrollCheck();
                }
            }
        };
        return ready_event_listener;
    })();
    gg.shortcut = function(e){
        gg.isCombo = false;
        gg.rmhelp();
        var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
        var charCode = (e.charCode) ? e.charCode : e.keyCode;
        var character = String.fromCharCode(charCode).toLowerCase();
        if(character != '?' && gg.isHelp) gg.isHelp = false;
        switch(character) {
            case '/':
                gg.focusSearchBox(e);
                gg.removeElementById('ggshortcut-anchor'), gg.glb_post = false;
                break;
            case '?':
                if(gg.isHelp) { gg.rmhelp(); gg.isHelp = false; }
                else { gg.help(); gg.isHelp = true; }
                break;
            case gg.config.dynamic.up[0]:
                gg.scroller('up');
                break;
            case gg.config.dynamic.down[0]:
                gg.scroller('down');
                break;
            case gg.config.dynamic.next[0]:
                gg.transport(gg.config.dynamic.rel_next[0]);
                break;
            case gg.config.dynamic.prev[0]:
                gg.transport(gg.config.dynamic.rel_prev[0]);
                break;
            default:
                break;
        }
    };
    gg.shortcut.combo = function(e){
        var node = (e.target) ? e.target : ((e.srcElement) ? e.srcElement : null);
        var charCode = (e.charCode) ? e.charCode : e.keyCode;
        var character = String.fromCharCode(charCode).toLowerCase();
        switch (character) {
            case gg.config.dynamic.home[0]:
                gg.transport(gg.config.dynamic.rel_home[0]);
                gg.isCombo = false;
                break;
            case gg.config.dynamic.top[0]:
                gg.interval = setInterval(function(){gg.scroll( 0 );},10);
                gg.isCombo = false, gg.count = false;
                gg.removeElementById('ggshortcut-anchor'), gg.glb_post = false;
                break;
            default:
                gg.shortcut(e);
                break;
        }
    };
    gg.ready(function(){
        gg.overrideKey();
        document.onkeypress = function(e) {
            e = (e) ? e:((event) ? event : null);
            if(gg.isInput(e)) return;
            //gg.cancel(e);
            var charCode = (e.charCode) ? e.charCode : e.keyCode;
            var character = String.fromCharCode(charCode).toLowerCase();
            switch(character) {
                case gg.config.dynamic.combo[0]:
                    gg.isCombo = 'combo';
                    break;
                default:
                    switch(gg.isCombo) {
                        case 'combo':
                            gg.shortcut.combo(e);
                            break;
                        default:
                            gg.shortcut(e);
                            break;
                    }
                    break;
            }
        }; // end onkeypress function
        document.onkeydown = function(e) {
            e = (e) ? e:((event) ? event:null);
            var charCode = (e.charCode) ? e.charCode : e.keyCode;
            switch(charCode){
                case 27:
                    gg.blur(e);
                    gg.rmhelp();
                    gg.isHelp = false;
                    break;
                case 13:
                    if(!gg.glb_post) return;
                    gg.getPermalink(gg.glb_post);
                    break;
                default:
                    break;
            }
        };
    });
})(window);
