/*                                                    *\
 *  netnrmd v2.0.0
 *  
 *  netnrmd编辑器（Monaco Editor 编辑器 + Marked 解析 + highlight 代码高亮）
 *  
 *  Site：https://md.netnr.com
 *  GitHub：https://github.com/netnr/netnrmd
 *  Gitee：https://gitee.com/netnr/netnrmd
 *  Date：2019-08-15
 *  
 *  Author：netnr
 *                                                   */

(function (window) {

    var netnrmd = function (id, obj) { return new netnrmd.fn.init(id, obj) }

    netnrmd.fn = netnrmd.prototype = {
        init: function (id, obj) {
            var that = this;
            obj = obj || {};

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
                        title: '删除/del',
                        icon: 'strikethrough',
                        key: 'D'
                    }, {
                        title: '标题/header',
                        icon: 'header',
                        key: 'H'
                    }, {
                        title: '引用/blockquote',
                        icon: 'quote-left',
                        key: 'Q',
                        cmd: 'quote'
                    }, {
                        title: '有序列表/ol',
                        icon: 'list-ol',
                        key: 'O'
                    }, {
                        title: '无序列表/ul',
                        icon: 'list-ul',
                        key: 'U'
                    }, {
                        title: '链接/link',
                        icon: 'link',
                        key: 'L'
                    }, {
                        title: '图片/image',
                        icon: 'image',
                        key: 'G'
                    }, {
                        title: '表格/table',
                        icon: 'table',
                        key: 'T'
                    }, {
                        title: '代码/code',
                        icon: 'code',
                        key: 'K'
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
                    }
                ]);

            //Monaco Editor容器
            obj.mebox = $(id);

            //编辑器父容器
            obj.container = obj.mebox.parent();

            //工具条
            var lis = [];
            $(obj.items).each(function () {
                var lcs = this.float == "right" ? 'float-right' : '',
                    keytip = this.key ? obj.prefixkey + this.key : '';
                lis.push('<li class="' + lcs + '"><span data-cmd="' + (this.cmd || this.icon) + '" class="' + obj.prefixicon + this.icon + '" title="' + this.title + ' ' + keytip + '"></span></li>');
            });
            //工具条加持命令响应
            obj.toolbar = $('<div class="netnrmd-toolbar"><ul class="netnrmd-menu"></li></div>').children().append($(lis.join(''))).click(function (e) {
                e = e || window.event;
                var target = e.target || window.event.target;
                if (target.nodeName == "SPAN") {
                    var cmdname = target.getAttribute('data-cmd');
                    //执行命令
                    netnrmd.cmd(cmdname, that);
                }
            }).end();
            //写
            obj.write = $('<div class="netnrmd-write"></div>').append(obj.mebox);
            //视图
            obj.view = $('<div class="netnrmd-body netnrmd-view"></div>');
            //编辑器
            obj.editor = $('<div class="netnrmd"></div>').append(obj.toolbar).append(obj.write).append(obj.view);

            //渲染前回调
            if (typeof obj.viewbefore == "function") {
                obj.viewbefore.call(obj)
            }

            //载入编辑器
            obj.container.append(obj.editor);

            //Monaco Editor对象
            obj.me = monaco.editor.create(obj.mebox[0], {
                language: 'markdown',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                minimap: { enabled: false }
            });

            //编辑器内容变动回调
            obj.me.onDidChangeModelContent(function () {
                if (typeof obj.input == "function" && obj.input.call(that) == false) {
                    return false;
                }

                //自动保存
                if (obj.autosave) {
                    that.setstore();
                }

                //渲染
                that.render();
            });

            //滚动条同步
            obj.me.onDidScrollChange(function (sc) {
                var hratio = sc.scrollTop / (sc.scrollHeight - obj.mebox.height() - 4);
                obj.view[0].scrollTop = (obj.view[0].scrollHeight - obj.view.height()) * hratio;
            });

            //按键事件监听
            $.each(obj.items, function () {
                var item = this;
                if (item.key) {
                    obj.me.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode["KEY_" + item.key], function () {
                        var cmdname = item.cmd || item.icon;
                        //执行命令
                        netnrmd.cmd(cmdname, that);
                    })
                }
            });

            this.obj = obj;

            //初始化响应配置

            //全屏
            this.toggleFullScreen(obj.fullscreen = netnrmd.dv(obj.fullscreen, false));
            $(window).resize(function () {
                if (obj.fullscreen) {
                    that.height($(window).height(), true);
                }
            });
            //视图模式：1输入|2分屏|3预览
            obj.viewmodel = netnrmd.dv(obj.viewmodel, 2);
            //高度
            this.height(obj.height = netnrmd.dv(obj.height, 250));
            //本地保存键
            obj.storekey = netnrmd.dv(obj.storekey, "netnrmd_markdown");
            //本地自动保存
            obj.autosave = netnrmd.dv(obj.autosave, true);
            //载入本地保存
            if (obj.autosave > 0) {
                this.getstore();
            }

            obj.mebox.data('netnrmd', this);
            return this;
        },
        //获取焦点
        focus: function () {
            this.obj.me.focus();
            return this;
        },
        //设置高度
        height: function (height, force) {
            if (height != null) {
                if (force || !this.obj.fullscreen) {
                    !this.obj.fullscreen && (this.obj.height = height);
                    var weh = height - (this.obj.toolbar.is(':hidden') ? 0 : this.obj.toolbar.outerHeight());
                    this.obj.write.css('height', weh);
                    this.obj.mebox.css('height', weh);
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
            var obj = this.obj;
            obj.splitscreen = !obj.splitscreen;
            if (splitscreen != null) {
                obj.splitscreen = splitscreen;
            }
            if (!obj.splitscreen) {
                this.togglePreview(0);

                obj.write.addClass('netnrmd-write-w100');
                obj.view.addClass('netnrmd-view-hidden');
            } else {
                obj.write.removeClass('netnrmd-write-w100');
                obj.view.removeClass('netnrmd-view-hidden');
            }
        },
        //预览切换
        togglePreview: function (preview) {
            var obj = this.obj;
            obj.preview = !obj.preview;
            if (preview != null) {
                obj.preview = preview;
            }
            if (obj.preview) {
                this.toggleSplitScreen(1);
                obj.write.addClass('netnrmd-write-hidden');
                obj.view.addClass('netnrmd-view-w100');
            } else {
                obj.write.removeClass('netnrmd-write-hidden');
                obj.view.removeClass('netnrmd-view-w100');
            }
        },
        //视图切换
        toggleView: function (n) {
            if (n == null) {
                n = this.obj.viewmodel - 1;
                if (n < 1) {
                    n = 3;
                }
            }
            this.obj.viewmodel = n;
            switch (n) {
                case 1:
                    this.togglePreview(0);
                    this.toggleSplitScreen(0);
                    break;
                case 2:
                    this.togglePreview(0);
                    this.toggleSplitScreen(1);
                    break;
                case 3:
                    this.toggleSplitScreen(0);
                    this.togglePreview(1);
                    break;
            }
        },
        //根据命令获取工具条的对象
        getToolItemTarget: function (cmd) {
            var target;
            this.obj.toolbar.find('span').each(function () {
                if (this.getAttribute('data-cmd') == cmd) {
                    target = this;
                    return false;
                }
            });
            return target;
        },
        //赋值md
        setmd: function (md) {
            this.obj.me.setValue(md);
            return this;
        },
        //获取md
        getmd: function () {
            return this.obj.me.getValue();
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
        //清理md、html、本地缓存
        clear: function () {
            this.setmd('');
            this.sethtml('<div class="netnrmd-view-empty">预览区域</div>');
            this.setstore();
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
                        that.sethtml(marked(md, {
                            highlight: function (str, lang) {
                                if (window.hljs && hljs.getLanguage(lang)) {
                                    try {
                                        return hljs.highlight(lang, str).value;
                                    } catch (__) { }
                                }
                                try {
                                    return hljs.highlightAuto(str).value;
                                } catch (__) { }
                                return '';
                            },
                            sanitize: true,
                            sanitizer: function (html) {
                                var temp = document.createElement("div");
                                (temp.textContent != undefined) ? (temp.textContent = html) : (temp.innerText = html);
                                var output = temp.innerHTML;
                                temp = null;
                                return output;
                            },
                            gfm: true
                        }));
                    }
                }
            }, that.obj.defer);
        },
        //隐藏
        hide: function (area) {
            switch (area) {
                case "toolbar":
                    this.obj.toolbar.hide();
                    break;
                default:
                    this.obj.editor.hide();
            }
        },
        //显示
        show: function (area) {
            switch (area) {
                case "toolbar":
                    this.obj.toolbar.show();
                    break;
                default:
                    this.obj.editor.show();
            }
        },
        //写入本地保存
        setstore: function () {
            localStorage[this.obj.storekey] = this.getmd();
        },
        //获取本地保存
        getstore: function () {
            var md = localStorage[this.obj.storekey]
            if (md) {
                this.setmd(md);
                this.render();
            }
        }
    }

    netnrmd.fn.init.prototype = netnrmd.fn;

    //命令
    netnrmd.cmd = function (cmdname, that) {

        var obj = that.obj, txt = obj.mebox[0];

        //允许响应命令
        if (obj.preview && "help,preview,split,full".indexOf(cmdname) == -1) {
            return false;
        }

        //执行命令前回调
        if (typeof obj.cmdcallback == "function") {
            if (obj.cmdcallback.call(txt, cmdname) == false) {
                return false;
            }
        }

        var ops = {
            me: obj.me,
            cmd: cmdname,
            txt: obj.mebox[0],
            before: '',
            defaultvalue: '',
            after: '',
            isdo: true
        }
        switch (cmdname) {
            case "bold":
                ops.before = '**';
                ops.defaultvalue = '粗体';
                ops.after = '**';
                break;
            case "italic":
                ops.before = '_';
                ops.defaultvalue = '斜体';
                ops.after = '_';
                break;
            case "strikethrough":
                ops.before = '~~';
                ops.defaultvalue = '删除';
                ops.after = '~~';
                break;
            case "header":
                ops.defaultvalue = '标题';
                ops.before = '### ';
                break;
            case "quote":
                ops.before = '> ';
                break;
            case "list-ol":
                ops.before = '1. ';
                ops.defaultvalue = '列表文本';
                break;
            case "list-ul":
                ops.before = '- ';
                ops.defaultvalue = '列表文本';
                break;
            case "link":
                ops.before = '[链接说明](';
                ops.defaultvalue = 'https://';
                ops.after = ')';
                break;
            case "image":
                ops.before = '![图片说明](';
                ops.defaultvalue = 'https://';
                ops.after = ')';
                break;
            case "table":
                var cols = ' col 1 | col 2 | col 3 ', hd = ' ---- | ---- | ---- ', nl = '\r\n';
                ops.before = cols + nl + hd + nl + cols + nl + cols + nl;
                break;
            case "code":
                {
                    if (obj.me.getSelection().startColumn == 1) {
                        ops.before = '```\n';
                        ops.after = '\n```';
                    } else {
                        ops.before = '`';
                        ops.after = '`';
                    }
                    ops.defaultvalue = '输入代码';
                }
                break;
            case "line":
                ops.before = '---\r\n';
                break;
            case "help":
                ops.isdo = false;
                window.open('https://netnr.gitee.io/markdownguide/', '_blank');
                break;
            case "full":
                ops.isdo = false;
                $(txt).data('netnrmd').toggleFullScreen();
                break;
            case "split":
                ops.isdo = false;
                $(txt).data('netnrmd').toggleView();
                break;
        }
        ops.isdo && netnrmd.insertxt(ops);
    };

    //默认值
    netnrmd.dv = function (obj, v) {
        return (obj == null || obj == undefined) ? v : obj;
    }

    // 获取选中文字
    netnrmd.getSelectText = function (me) {
        var gse = me.getSelection(), gm = me.getModel(), rows = [];
        if (gse.startLineNumber == gse.endLineNumber) {
            var row = gm.getLineContent(gse.startLineNumber);
            row = row.substring(gse.startColumn - 1, gse.endColumn - 1);
            rows.push(row)
        } else {
            for (var i = gse.startLineNumber; i <= gse.endLineNumber; i++) {
                var row = gm.getLineContent(i);
                if (i == gse.startLineNumber) {
                    row = row.substring(gse.startColumn - 1);
                }
                if (i == gse.endLineNumber) {
                    row = row.substring(0, gse.endColumn - 1);
                }
                rows.push(row);
            }
        }
        return rows;
    }

    // 选中特定范围的文本
    netnrmd.setSelectText = function (me, startRow, startPos, endRow, endPos) {
        me.setSelection(new monaco.Selection(startRow, startPos, endRow, endPos));
        me.focus();
    }

    // 在光标后插入文本
    netnrmd.insertAfterText = function (me, text) {
        var gse = me.getSelection();
        var range = new monaco.Range(gse.startLineNumber, gse.startColumn, gse.endLineNumber, gse.endColumn);
        var op = { identifier: { major: 1, minor: 1 }, range: range, text: text, forceMoveMarkers: true };
        me.executeEdits("", [op]);
        me.focus();
    }

    //插入内容
    netnrmd.insertxt = function (ops) {
        if (ops.cmd && ops.cmd != "") {
            var txt = ops.txt, before = ops.before, defaultvalue = ops.defaultvalue, after = ops.after;
            var gse = ops.me.getSelection();
            var text = netnrmd.getSelectText(ops.me);
            if (text.join('').trim() == "") {
                text = defaultvalue;
            } else {
                text = text.join('\n');
            }

            netnrmd.insertAfterText(ops.me, before + text + after);

            var startPos = gse.startColumn + before.length,
                endPos = startPos + text.length,
                startLine = gse.startLineNumber,
                addline = before.split('\n').length - 1;
            //有换行时选择下一行
            if (addline) {
                startLine += addline;
                startPos = 0;
                endPos = 99;
            }
            netnrmd.setSelectText(ops.me, startLine, startPos, startLine, endPos);

            //编辑器内容变动回调
            var that = $(txt).data('netnrmd'), obj = that.obj;
            if (typeof obj.input == "function" && obj.input.call(that) == false) {
                return false;
            }
            that.render();
        }
    }

    //按键支持
    netnrmd.supperkey = function (e) {
        var key = e.keyCode || e.which || e.charCode;
        if (e.ctrlKey) {
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

})(window);