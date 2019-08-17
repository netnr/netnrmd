//netnrmd 功能扩展

(function (netnrmd) {

    netnrmd.extend = {
        //表情
        emoji: {
            //按钮
            button: { title: '表情', cmd: 'emoji', svg: "M512 1024A512 512 0 1 0 512 0a512 512 0 0 0 0 1024zM512 96a416 416 0 1 1 0 832 416 416 0 0 1 0-832zM256 320a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m384 0a64 64 0 1 1 128 0 64 64 0 0 1-128 0z m64.128 307.264l82.304 49.408C730.496 769.728 628.544 832 512 832s-218.432-62.272-274.432-155.328l82.304-49.408C359.04 692.416 430.4 736 512 736s152.896-43.584 192.128-108.736z" },
            //动作
            action: function (that) {
                if (!that.emojipopup) {
                    //构建弹出内容
                    var htm = [], epath = "https://emoji.netnr.com/emoji/wangwang/", emojis = ["微笑", "害羞", "吐舌头", "偷笑", "爱慕", "大笑", "跳舞", "飞吻", "安慰", "抱抱", "加油", "胜利", "强", "亲亲", "花痴", "露齿笑", "查找", "呼叫", "算账", "财迷", "好主意", "鬼脸", "天使", "再见", "流口水", "享受", "色情狂", "呆", "思考", "迷惑", "疑问", "没钱了", "无聊", "怀疑", "嘘", "小样", "摇头", "感冒", "尴尬", "傻笑", "不会吧", "无奈", "流汗", "凄凉", "困了", "晕", "忧伤", "委屈", "悲伤", "大哭", "痛哭", "I服了U", "对不起", "再见（舍不得）", "皱眉", "好累", "生病", "吐", "背", "惊讶", "惊愕", "闭嘴", "欠扁", "鄙视", "大怒", "生气", "财神", "学习雷锋", "恭喜发财", "小二", "老大", "邪恶", "单挑", "CS", "忍者", "炸弹", "惊声尖叫", "漂亮MM", "帅GG", "招财猫", "成绩", "鼓掌", "握手", "红唇", "玫瑰", "残花", "爱心", "心碎", "钱", "购物", "礼物", "收邮件", "电话", "举杯庆祝", "时钟", "等待", "很晚了（晚安）", "飞机（空运）", "支付宝"];
                    for (var i = 0; i < emojis.length; i++) {
                        htm.push('<img class="netnrmd-emoji" title="' + emojis[i] + '" src="' + epath + i + '.gif" />');
                    }
                    //弹出
                    that.emojipopup = netnrmd.popup("表情", htm.join(''));
                    //选择表情
                    $(that.emojipopup).click(function (e) {
                        e = e || window.event;
                        var target = e.target || e.srcElement;
                        if (target.nodeName == "IMG") {
                            netnrmd.insertAfterText(that.obj.me, '![emoji](' + target.src + ' "' + target.title + '")\n');
                            $(that.emojipopup).hide();
                        }
                    })
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

                    //选择文件上传，该上传接口仅为演示使用，仅支持图片格式的附件
                    $(that.uploadpopup).find('input').change(function () {
                        var file = this.files[0];
                        if (file) {
                            if (file.size > 1024 * 1024 * 10) {
                                alert('文件过大')
                                this.value = "";
                                return;
                            }
                            if (file.type.indexOf('image') != 0) {
                                alert('仅支持图片')
                                this.value = "";
                                return;
                            }

                            var fd = new FormData();
                            fd.append('file', "multipart");
                            fd.append('Filedata', file);

                            //发起上传
                            var xhr = new XMLHttpRequest();
                            xhr.upload.onprogress = function (event) {
                                if (event.lengthComputable) {
                                    //上传百分比
                                    var per = (event.loaded / event.total) * 100;
                                    per = per.toFixed(2) + " %";
                                    console.log(per);
                                }
                            };

                            xhr.open("post", "//api.uomg.com/api/image.ali", true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                            xhr.send(fd);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    if (xhr.status == 200) {
                                        console.log(xhr.responseText)
                                        var url = JSON.parse(xhr.responseText).imgurl;
                                        if (url) {
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
        }
    }

})(netnrmd);