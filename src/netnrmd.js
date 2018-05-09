/*                                                    *\
 *  netnrmd v1.0.0
 *  markdown语法解析基于remarkable，编辑与解析分离
 *  调用任意markdown解析器都能完美的运行
 *  
 *  Site：https://md.netnr.com
 *  GitHub：https://github.com/netnr/netnrmd
 *  Gitee：https://gitee.com/netnr/netnrmd
 *  Date：2018-05-09
 *  
 *  Author：netnr
 *  Domain：https://www.netnr.com
 *                                                   */

(function (window) {

    var netnrmd = function (id, obj) { return new netnrmd.fn.init(id, obj) }

    netnrmd.fn = netnrmd.prototype = {
        init: function (id, obj) {
            var that = this;
            obj = obj || {};

            //默认解析器基于Remarkable
            if (typeof obj.render != "function") {
                //配置，具体参数参见官方文档
                obj.html = netnrmd.dv(obj.html, false);
                obj.xhtmlOut = netnrmd.dv(obj.xhtmlOut, false);
                obj.langPrefix = netnrmd.dv(obj.langPrefix, 'language-');
                obj.linkify = netnrmd.dv(obj.linkify, true);
                obj.typographer = netnrmd.dv(obj.typographer, false);
                obj.quotes = netnrmd.dv(obj.quotes, '“”‘’');
                obj.highlight = netnrmd.dv(obj.highlight, function (str, lang) {
                    if (window.hljs && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(lang, str).value;
                        } catch (__) { }
                    }
                    try {
                        return hljs.highlightAuto(str).value;
                    } catch (__) { }
                    return '';
                });
                this.md = new Remarkable(obj);
            }

            //解析延迟毫秒
            obj.defer = netnrmd.dv(obj.defer, 500);
            //工具条矢量图标样式前缀
            obj.prefixicon = netnrmd.dv(obj.prefixicon, 'fa fa-');
            //快捷键前缀
            obj.prefixkey = netnrmd.dv(obj.prefixkey, 'Ctrl+');
            //工具栏
            obj.items = netnrmd.dv(obj.items,
                [
                    {
                        title: '粗体/bold',
                        icon: 'bold',
                        key: 'B'
                    }, {
                        title: '斜体/italic',
                        icon: 'italic',
                        key: 'I'
                    }, {
                        title: '链接/link',
                        icon: 'link',
                        key: 'L'
                    }, {
                        title: '引用/blockquote',
                        icon: 'quote-left',
                        key: 'Q',
                        cmd: 'quote'
                    }, {
                        title: '标题/header',
                        icon: 'header',
                        key: 'H'
                    }, {
                        title: '代码/code',
                        icon: 'code',
                        key: 'K'
                    }, {
                        title: '图片/image',
                        icon: 'image',
                        key: 'G'
                    }, {
                        title: '有序列表/ol',
                        icon: 'list-ol',
                        key: 'O'
                    }, {
                        title: '无序列表/ul',
                        icon: 'list-ul',
                        key: 'U'
                    }, {
                        title: '表格/table',
                        icon: 'table',
                        key: 'T'
                    }, {
                        title: '分隔线/line',
                        icon: 'minus',
                        key: 'R',
                        cmd: 'line'
                    }, {
                        title: '帮助/help',
                        icon: 'question',
                        cmd: 'help'
                    }, {
                        title: '全屏/fullscreen',
                        icon: 'arrows-alt',
                        key: 'M',
                        cmd: 'full',
                        float: 'right'
                    }, {
                        title: '分屏/splitscreen',
                        icon: 'columns',
                        cmd: 'split',
                        float: 'right'
                    }, {
                        title: '预览/preview',
                        icon: 'eye',
                        cmd: 'preview',
                        float: 'right'
                    }
                ]);

            //编写触发
            obj.textarea = $(id).on('input', function () {
                //编辑器内容变动回调
                if (typeof obj.input == "function" && obj.input.call(that) == false) {
                    return false;
                }
                that.render();
            }).keydown(function (e) {
                e = e || window.event;
                //按键支持
                netnrmd.supperkey.call(this, e);
            }).on('keyup paste cut mouseup scroll', function () {
                //滚动条同步
                netnrmd.syncscroll(this, 100);
            });

            //编辑器父容器
            obj.container = obj.textarea.parent();

            //渲染前回调
            if (typeof obj.viewbefore == "function") {
                obj.viewbefore.call(obj)
            }

            //工具条
            var lis = [];
            $(obj.items).each(function () {
                var lcs = this.float == "right" ? 'float-right' : '',
                    keytip = this.key ? obj.prefixkey + this.key : '';
                lis.push('<li class="' + lcs + '"><a href="#' + (this.cmd || this.icon) + '" class="' + obj.prefixicon + this.icon + '" title="' + this.title + ' ' + keytip + '"></a></li>');
            });
            //工具条加持命令响应
            obj.toolbar = $('<div class="netnrmd-toolbar"><ul class="netnrmd-menu"></li></div>').children().append($(lis.join(''))).click(function (e) {
                e = e || window.event;
                var target = e.target || window.event.target;
                if (target.nodeName == "A") {
                    if (e.preventDefault) { e.preventDefault() } else { window.event.returnValue = false }
                    var cmdname = target.hash.substring(1);

                    //执行命令
                    netnrmd.cmd(cmdname, that);
                }
            }).end();
            //写
            obj.write = $('<div class="netnrmd-write"></div>').append(obj.textarea);
            //视图
            obj.view = $('<div class="netnrmd-body netnrmd-view"></div>');
            //编辑器
            obj.editor = $('<div class="netnrmd"></div>').append(obj.toolbar).append(obj.write).append(obj.view);

            //载入编辑器
            obj.container.append(obj.editor);

            this.obj = obj;

            //初始化响应配置

            //全屏
            this.toggleFullScreen(obj.fullscreen = netnrmd.dv(obj.fullscreen, false));
            $(window).resize(function () {
                if (obj.fullscreen) {
                    that.height($(window).height(), true);
                }
            });
            //分屏
            this.toggleSplitScreen(obj.splitscreen = netnrmd.dv(obj.splitscreen, true));
            //预览
            this.togglePreview(obj.preview = netnrmd.dv(obj.preview, false));
            //高度
            this.height(obj.height = netnrmd.dv(obj.height, 250));
            //清空
            this.clear();

            obj.textarea.data('netnrmd', this);
            return this;
        },
        //获取焦点
        focus: function () {
            this.obj.textarea[0].focus();
            return this;
        },
        //设置高度
        height: function (height, force) {
            if (height != null) {
                if (force || !this.obj.fullscreen) {
                    !this.obj.fullscreen && (this.obj.height = height);
                    var weh = height - this.obj.toolbar.height();
                    this.obj.write.css('height', weh);
                    this.obj.view.css('height', weh);
                }
                return this;
            } else {
                return this.obj.height;
            }
        },
        //全屏切换
        toggleFullScreen: function (fullscreen) {
            var obj = this.obj, tit = this.getToolItemTarget('full');
            obj.fullscreen = !obj.fullscreen;
            if (fullscreen != null) {
                obj.fullscreen = fullscreen;
            }
            if (!obj.fullscreen) {
                obj.editor.removeClass('netnrmd-fullscreen');
                $(tit).removeClass('active');
                this.height(obj.height, true);
            } else {
                obj.editor.addClass('netnrmd-fullscreen');
                $(tit).addClass('active');
                this.height($(window).height(), true);
            }
        },
        //分屏切换
        toggleSplitScreen: function (splitscreen) {
            var obj = this.obj, tit = this.getToolItemTarget('split');
            obj.splitscreen = !obj.splitscreen;
            if (splitscreen != null) {
                obj.splitscreen = splitscreen;
            }
            if (!obj.splitscreen) {
                this.togglePreview(0);

                obj.write.addClass('netnrmd-write-w100');
                obj.view.addClass('netnrmd-view-hidden');
                $(tit).removeClass('active');
            } else {
                obj.write.removeClass('netnrmd-write-w100');
                obj.view.removeClass('netnrmd-view-hidden');
                $(tit).addClass('active');
            }
        },
        //预览切换
        togglePreview: function (preview) {
            var obj = this.obj, tit = this.getToolItemTarget('preview');
            obj.preview = !obj.preview;
            if (preview != null) {
                obj.preview = preview;
            }
            if (obj.preview) {
                this.toggleSplitScreen(1);
                obj.write.addClass('netnrmd-write-hidden');
                obj.view.addClass('netnrmd-view-w100');
                $(tit).addClass('active');
            } else {
                obj.write.removeClass('netnrmd-write-hidden');
                obj.view.removeClass('netnrmd-view-w100');
                $(tit).removeClass('active');
            }
        },
        //根据命令获取工具条的对象
        getToolItemTarget: function (cmd) {
            var target;
            this.obj.toolbar.find('a').each(function () {
                if (this.hash == "#" + cmd) {
                    target = this;
                    return false;
                }
            });
            return target;
        },
        //过滤命令
        cmdFilter: function (cmd) {
            if (this.obj.preview && "help,preview,split,full".indexOf(cmd) == -1) {
                return false;
            }
            return true;
        },
        //赋值md
        setmd: function (md) {
            this.obj.textarea.val(md);
            return this;
        },
        //获取md
        getmd: function () {
            return this.obj.textarea.val();
        },
        //呈现html
        sethtml: function (html) {
            this.obj.view.html(html);
            return this;
        },
        //获取html
        gethtml: function () {
            return this.obj.view.html();
        },
        //清理md、html
        clear: function () {
            this.setmd('');
            this.sethtml('<div class="netnrmd-view-empty">预览区域</div>');
        },
        //渲染
        render: function () {
            var that = this;
            clearTimeout(that.obj.deferIndex);
            that.obj.deferIndex = setTimeout(function () {
                var md = that.getmd();
                if (md == "") {
                    that.clear();
                } else {
                    if (typeof that.obj.render == "function") {
                        that.sethtml(that.obj.render(md));
                    } else {
                        that.sethtml(that.md.render(md));
                    }
                }
            }, that.obj.defer);
        }
    }

    netnrmd.fn.init.prototype = netnrmd.fn;

    //版本
    netnrmd.version = "1.0.0";

    //命令
    netnrmd.cmd = function (cmdname, that) {
        var obj = that.obj, txt = obj.textarea[0];

        //允许响应命令
        if (that.cmdFilter(cmdname) == false) {
            return false;
        }

        //执行命令前回调
        if (typeof obj.cmdcallback == "function") {
            if (obj.cmdcallback.call(txt, cmdname) == false) {
                return false;
            }
        }

        var ops = {
            cmd: cmdname,
            txt: obj.textarea[0],
            before: '',
            defaultvalue: '',
            after: ''
        }
        switch (cmdname) {
            case "bold":
                ops.before = '**';
                ops.defaultvalue = '粗体';
                ops.after = '**';
                break;
            case "italic":
                ops.before = '*';
                ops.defaultvalue = '斜体';
                ops.after = '*';
                break;
            case "link":
                ops.before = '[链接说明](';
                ops.defaultvalue = 'https://';
                ops.after = ')';
                break;
            case "quote":
                ops.before = '> ';
                break;
            case "header":
                ops.defaultvalue = '标题';
                ops.before = '### ';
                break;
            case "code":
                {
                    var tbs = txt.value.substring(0, netnrmd.getCursortPosition(txt)).split('\n');
                    if (tbs[tbs.length - 1] == "") {
                        ops.before = '```\n';
                        ops.after = '\n```';
                    } else {
                        ops.before = '`';
                        ops.after = '`';
                    }
                    ops.defaultvalue = '输入代码';
                }
                break;
            case "image":
                ops.before = '![图片说明](';
                ops.defaultvalue = 'https://';
                ops.after = ')';
                break;
            case "list-ol":
                ops.before = '1. ';
                ops.defaultvalue = '列表文本';
                break;
            case "list-ul":
                ops.before = '- ';
                ops.defaultvalue = '列表文本';
                break;
            case "table":
                var cols = ' col 1 | col 2 | col 3 ', hd = ' ---- | ---- | ---- ', nl = '\r\n';
                ops.before = cols + nl + hd + nl + cols + nl + cols + nl;
                break;
            case "line":
                ops.before = '----------\r\n';
                if (netnrmd.getCursortPosition(txt)) {
                    ops.before = '\r\n\r\n' + ops.before;
                }
                break;
            case "help":
                window.open('https://netnr.gitee.io/markdownguide/', '_blank');
                break;
            case "full":
                $(txt).data('netnrmd').toggleFullScreen();
                break;
            case "preview":
                $(txt).data('netnrmd').togglePreview();
                break;
            case "split":
                $(txt).data('netnrmd').toggleSplitScreen();
                break;
        }
        netnrmd.insertxt(ops);
    };

    //默认值
    netnrmd.dv = function (obj, v) {
        return (obj == null || obj == undefined) ? v : obj;
    }

    // 获取光标位置
    netnrmd.getCursortPosition = function (textDom) {
        var cursorPos = 0;
        if (document.selection) {
            textDom.focus();
            var selectRange = document.selection.createRange();
            selectRange.moveStart('character', -textDom.value.length);
            cursorPos = selectRange.text.length;
        } else if (textDom.selectionStart || textDom.selectionStart == '0') {
            cursorPos = textDom.selectionStart;
        }
        return cursorPos;
    }

    // 设置光标位置
    netnrmd.setCaretPosition = function (textDom, pos) {
        if (textDom.setSelectionRange) {
            textDom.focus();
            textDom.setSelectionRange(pos, pos);
        } else if (textDom.createTextRange) {
            var range = textDom.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    // 获取选中文字
    netnrmd.getSelectText = function (textDom) {
        var userSelection = '';
        if (textDom.selectionStart || textDom.selectionStart == '0') {
            userSelection = textDom.value.substring(textDom.selectionStart, textDom.selectionEnd);
        } else if (window.getSelection) {
            userSelection = window.getSelection();
        } else if (document.selection) {
            userSelection = document.selection.createRange().text;
        }
        return userSelection;
    }

    // 选中特定范围的文本
    netnrmd.setSelectText = function (textDom, startPos, endPos) {
        var startPos = parseInt(startPos), endPos = parseInt(endPos), textLength = textDom.value.length;
        if (textLength) {
            if (!startPos) {
                startPos = 0;
            }
            if (!endPos) {
                endPos = textLength;
            }
            if (startPos > textLength) {
                startPos = textLength;
            }
            if (endPos > textLength) {
                endPos = textLength;
            }
            if (textDom.createTextRange) {
                var range = textDom.createTextRange();
                range.moveStart("character", startPos);
                range.moveEnd("character", endPos - startPos);
                range.select();
            } else {
                textDom.setSelectionRange(startPos, endPos);
                textDom.focus();
            }
        }
    }

    // 在光标后插入文本
    netnrmd.insertAfterText = function (textDom, value) {
        var selectRange;
        if (document.selection) {
            textDom.focus();
            selectRange = document.selection.createRange();
            selectRange.text = value;
            textDom.focus();
        } else if (textDom.selectionStart || textDom.selectionStart == '0') {
            var startPos = textDom.selectionStart;
            var endPos = textDom.selectionEnd;
            var scrollTop = textDom.scrollTop;
            textDom.value = textDom.value.substring(0, startPos) + value + textDom.value.substring(endPos, textDom.value.length);
            textDom.focus();
            textDom.selectionStart = startPos + value.length;
            textDom.selectionEnd = startPos + value.length;
            textDom.scrollTop = scrollTop;
        }
        else {
            textDom.value += value;
            textDom.focus();
        }
    }

    //插入内容
    netnrmd.insertxt = function (ops) {
        if (ops.cmd && ops.cmd != "") {
            var txt = ops.txt, before = ops.before, defaultvalue = ops.defaultvalue, after = ops.after;
            var text = netnrmd.getSelectText(txt), pos = netnrmd.getCursortPosition(txt) + before.length;
            //未选择内容
            if (text.trim() == "") {
                text = defaultvalue;
            }
            netnrmd.insertAfterText(txt, before + text + after);
            netnrmd.setSelectText(txt, pos, pos + text.length);

            //编辑器内容变动回调
            var that = $(txt).data('netnrmd'), obj = that.obj;
            if (typeof obj.input == "function" && obj.input.call(that) == false) {
                return false;
            }
            that.render();
        }
    }

    //同步滚动条
    netnrmd.syncscroll = function (txtDom, defer) {
        clearTimeout(txtDom.syncdefer);
        txtDom.syncdefer = setTimeout(function () {
            var obj = $(txtDom).data('netnrmd').obj,
                hratio = txtDom.scrollTop / (txtDom.scrollHeight - $(txtDom).height());
            obj.view.animate({ scrollTop: obj.view[0].scrollHeight * hratio }, defer);
        }, defer);
    }

    //按键支持
    netnrmd.supperkey = function (e) {
        var key = e.keyCode || e.which || e.charCode;
        if (key == 9) {
            if (this.selectionStart || this.selectionStart == '0') {
                e.preventDefault();
                var start = this.selectionStart, end = this.selectionEnd,
                    text = this.value, tab = '　　';
                text = text.substr(0, start) + tab + text.substr(start);
                this.value = text;
                this.selectionStart = start + tab.length;
                this.selectionEnd = end + tab.length;
            }
            else {
                var code, sel, tmp, r;
                sel = event.srcElement.document.selection.createRange();
                r = event.srcElement.createTextRange();
                event.returnValue = false;
                if (sel.getClientRects().length > 1) {
                    code = sel.text;
                    tmp = sel.duplicate();
                    tmp.moveToPoint(r.getBoundingClientRect().left, sel.getClientRects()[0].top);
                    sel.setEndPoint("startToStart", tmp);
                    sel.text = "　　" + sel.text.replace(/\r\n/g, "\r\t");
                    code = code.replace(/\r\n/g, "\r\t");
                    r.findText(code);
                    r.select();
                }
                else {
                    sel.text = "　　";
                    sel.select();
                }
            }
            $(this).data('netnrmd').render();
        } else if (e.ctrlKey) {
            var that = $(this).data('netnrmd'), obj = that.obj,
                kv = String.fromCharCode(key).toUpperCase();
            if (kv != "") {
                $(obj.items).each(function () {
                    if (this.key == kv) {
                        if (e.preventDefault) { e.preventDefault() } else { window.event.returnValue = false }

                        var cmdname = this.cmd || this.icon;

                        //执行命令
                        netnrmd.cmd(cmdname, that);
                        return false;
                    }
                });
            }
        }
    };

    window.netnrmd = netnrmd;

})(window)