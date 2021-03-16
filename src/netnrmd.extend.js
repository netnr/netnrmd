//NetnrMD编辑器 功能扩展

netnrmd.extend = {
    //关于
    about: {
        //按钮
        button: { title: '关于', cmd: 'about', svg: "M616.282 34.31c64.875 3.514 114.594 58.488 111.047 122.79-3.546 64.297-59.015 113.572-123.891 110.058-64.879-3.513-114.595-58.49-111.049-122.79 3.547-64.3 59.014-113.574 123.893-110.058zM324.15 534.663s227.937-165.53 302.517-133.257c74.577 32.276-26.261 236.325-33.615 266.515-7.352 30.193-54.62 261.307 100.842 133.255 0 0 77.73-51.013-33.615 66.626-111.345 117.639-252.097 155.117-268.902 66.63-12.67-66.708 53.888-308.64 67.224-399.769 4.356-29.76-33.612 0-33.612 0S315.7 610.713 290.536 567.98c-4.007-6.807 22.947-27.69 33.614-33.317z" },
        //动作
        action: function (that) {
            if (!that.aboutpopup) {
                //构建弹出内容
                var htm = [];
                htm.push("<h1><img src='/favicon.ico' style='height:40px;vertical-align:bottom' /> NetnrMD编辑器</h1>");
                htm.push("<p>jQuery + Monaco Editor 编辑器 + Marked 解析 + DOMPurify 清洗 + highlight 代码高亮</p>");
                htm.push("<p><a href='https://github.com/netnr/netnrmd'>https://github.com/netnr/netnrmd</a></p>");
                htm.push("<p><a href='https://gitee.com/netnr/netnrmd'>https://gitee.com/netnr/netnrmd</a></p>");
                htm.push("<p>&copy; 2019 <a href='https://www.netnr.com' target='_blank'>Netnr</a>, The <a href='https://github.com/netnr/netnrmd/blob/master/LICENSE' target='_blank'>MIT</a> License</p>");
                //弹出
                that.aboutpopup = netnrmd.popup("关于", htm.join(''));
            }
            $(that.aboutpopup).show();
        }
    },
    //表情
    emoji: {
        //按钮
        button: { title: '表情', cmd: 'emoji', svg: "M512 1024A512 512 0 1 0 512 0a512 512 0 0 0 0 1024zM512 96a416 416 0 1 1 0 832 416 416 0 0 1 0-832zM256 320a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m384 0a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m64.128 307.264l82.304 49.408C730.496 769.728 628.544 832 512 832s-218.432-62.272-274.432-155.328l82.304-49.408C359.04 692.416 430.4 736 512 736s152.896-43.584 192.128-108.736z" },
        //动作
        action: function (that) {
            if (!that.emojipopup) {
                var epath = "https://cdn.jsdelivr.net/gh/netnr/cdn/libs/emoji/";
                $.getJSON(epath + "api.json", null, function (ej) {
                    //构建弹出内容
                    var htm = [], emojis = ej.filter(x => x.type == "wangwang")[0];
                    for (var i = 0; i < emojis.list.length; i++) {
                        var eurl = epath + emojis.type + '/' + i + emojis.ext;
                        htm.push('<img class="netnrmd-emoji" title="' + emojis.list[i] + '" src="' + eurl + '" />');
                    }
                    //弹出
                    that.emojipopup = netnrmd.popup("表情", htm.join(''));
                    //选择表情
                    $(that.emojipopup).click(function (e) {
                        e = e || window.event;
                        var target = e.target || e.srcElement;
                        if (target.nodeName == "IMG") {
                            netnrmd.insertAfterText(that.obj.me, '![emoji](' + target.src + ' "' + target.title + '")\n');

                            $(this).hide();
                        }
                    })
                });
            }
            $(that.emojipopup).show();
        }
    },
    //上传
    upload: {
        //按钮
        button: { title: '上传', cmd: 'upload', svg: "M1024 640.192C1024 782.912 919.872 896 787.648 896h-512C123.904 896 0 761.6 0 597.504 0 451.968 94.656 331.52 226.432 302.976 284.16 195.456 391.808 128 512 128c152.32 0 282.112 108.416 323.392 261.12C941.888 413.44 1024 519.04 1024 640.192z m-341.312-139.84L512 314.24 341.312 500.48h341.376z m-213.376 0v256h85.376v-256H469.312z" },
        //动作
        action: function (that) {
            if (!that.uploadpopup) {
                //构建弹出内容
                var htm = [];
                htm.push('<div style="height:100px;margin:15px;border:3px dashed #ddd">');
                htm.push('<input type="file" style="width:100%;height:100%;" />');
                htm.push('</div>');

                //保存创建的上传弹出
                that.uploadpopup = netnrmd.popup("上传", htm.join(''));
                var ptitle = $(that.uploadpopup).find('.np-header').find('span');

                //选择文件上传，该上传接口仅为演示使用，仅支持图片格式的附件
                $(that.uploadpopup).find('input').change(function () {
                    var file = this.files[0];
                    if (file) {
                        if (file.size > 1024 * 1024 * 5) {
                            alert('文件过大 （MAX 5 MB）')
                            this.value = "";
                            return;
                        }

                        var fd = new FormData();
                        fd.append('file', file);

                        //发起上传
                        var xhr = new XMLHttpRequest();
                        xhr.upload.onprogress = function (event) {
                            if (event.lengthComputable) {
                                //上传百分比
                                var per = ((event.loaded / event.total) * 100).toFixed(2);
                                if (per < 100) {
                                    ptitle.html(netnrmd.extend.upload.button.title + " （" + per + "%）");
                                } else {
                                    ptitle.html(netnrmd.extend.upload.button.title);
                                }
                            }
                        };

                        xhr.open("POST", "https://www.netnr.eu.org/api/v1/Upload", true);
                        xhr.send(fd);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    console.log(xhr.responseText)
                                    var res = JSON.parse(xhr.responseText);
                                    if (res.code == 200) {
                                        let url = "https://www.netnr.eu.org" + res.data.path;
                                        //上传成功，插入链接
                                        netnrmd.insertAfterText(that.obj.me, '[' + file.name + '](' + url + ')');
                                        $(that.uploadpopup).hide()
                                    } else {
                                        alert('上传失败');
                                    }
                                } else {
                                    alert('上传失败');
                                }
                            }
                        }
                    }
                })
            }
            $(that.uploadpopup).show().find('input').val('');
        }
    },
    //导出
    import: {
        //按钮
        button: { title: '导出', cmd: 'import', svg: "M877.49 381.468H668.638V68.191H355.36v313.277H146.51l365.489 365.49 365.49-365.49zM146.51 851.383v104.425h730.98V851.383H146.51z" },
        //动作
        action: function (that) {
            if (!that.importpopup) {
                //构建弹出内容
                var htm = [];
                htm.push("<div style='text-align:center;'>")
                "Markdown Html Word PDF Png".split(' ').map(function (x) {
                    htm.push(' <button style="margin:10px;font-size:1.5rem;">' + x + '</button> ');
                });
                htm.push("</div>");
                //弹出
                that.importpopup = netnrmd.popup("导出", htm.join(''));
                $(that.importpopup).click(function (e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    if (target.nodeName == "BUTTON") {
                        var bv = target.innerHTML.toLowerCase();
                        switch (bv) {
                            case "markdown":
                                netnrmd.down(that.getmd(), 'nmd.md')
                                break;
                            case "html":
                            case "word":
                                {
                                    var netnrmd_body = that.gethtml();
                                    $.get("src/netnrmd.css", null, function (netnrmd_style) {
                                        var html = `
                                                <!DOCTYPE html>
                                                <html>
                                                    <head>
                                                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                                                    <style type="text/css">
                                                        ${netnrmd_style}
                                                    </style>
                                                    </head>
                                                    <body>
                                                    <div class="markdown-body">${netnrmd_body}</div>
                                                    </body>
                                                </html>
                                            `;

                                        if (bv == "html") {
                                            netnrmd.down(html, 'nmd.html');
                                        }
                                        else if (bv == "word") {
                                            require(['https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.min.js'], function (module) {
                                                netnrmd.down(module.asBlob(html), "nmd.docx");
                                            });
                                        }
                                    });
                                }
                                break;
                            case "pdf":
                                require(['https://cdn.jsdelivr.net/gh/eKoopmans/html2pdf.js/dist/html2pdf.bundle.min.js'], function (module) {
                                    var ch = that.obj.view.height();
                                    that.obj.view.height('auto');
                                    var vm = that.obj.viewmodel;
                                    that.toggleView(3);
                                    module(that.obj.view[0], {
                                        margin: 3,
                                        filename: 'nmd.pdf',
                                        html2canvas: { scale: 1.5 }
                                    }).then(function () {
                                        that.obj.view.height(ch);
                                        that.toggleView(vm);
                                    })
                                })
                                break;
                            case "png":
                                {
                                    var backvm = false;
                                    if (that.obj.viewmodel == 1) {
                                        that.toggleView(2);
                                        backvm = true;
                                    }

                                    require(['https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.7/dist/html2canvas.min.js'], function (module) {
                                        var ch = that.obj.view.height();
                                        that.obj.view.height('auto');
                                        module(that.obj.view[0], {
                                            scale: 1.5,
                                            margin: 15
                                        }).then(function (canvas) {
                                            that.obj.view.height(ch);
                                            netnrmd.down(canvas, "nmd.png");

                                            if (backvm) {
                                                that.toggleView(1);
                                            }
                                        })
                                    })
                                }
                                break;
                        }

                        $(this).hide();
                    }
                })
            }
            $(that.importpopup).show();
        }
    }
}

netnrmd.down = function (content, file) {
    var aTag = document.createElement('a');
    aTag.download = file;
    if (content.nodeType == 1) {
        aTag.href = content.toDataURL();
    } else {
        var blob = new Blob([content]);
        aTag.href = URL.createObjectURL(blob);
    }
    document.body.appendChild(aTag);
    aTag.click();
    aTag.remove();
}
