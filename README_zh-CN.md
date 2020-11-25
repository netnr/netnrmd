[English](README.md) | 简体中文

# NetnrMD编辑器
jQuery + Monaco Editor 编辑器 + Marked 解析 + DOMPurify 清洗 + highlight 代码高亮

> <https://md.netnr.com>

### [变更日志](changelog_zh-CN.md)

### Install 安装

<https://www.jsdelivr.com/package/npm/netnrmd>

```html
<div>
    <div id="editor">Loading ...</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js"></script>

<link href="src/netnrmd.css" rel="stylesheet" />
<script src="src/netnrmd.bundle.js"></script>
<script src="src/netnrmd.extend.js"></script>
<script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs/loader.js"></script>

<script>
    require.config({
        paths: {
            vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs'
        },
        'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
    });

    require(['vs/editor/editor.main'], function () {

        //初始化
        window.nmd = new netnrmd('#editor');
    });
</script>
```

### Options 选项

```js
var nmd = new netnrmd('#editor', {
	//视图,1输入，2分屏，3预览，默认2
	viewmodel: 2

    //编辑器字体大小
    fontsize: 16,

	//高度
    height: 300,
	//延迟解析（毫秒）
    defer: 300,

	//自动保存键，默认netnrmd_markdown，一个页面有多netnrmd编辑器时需要对应配置
	storekey: "key",
	//默认有变化自动保存
	autosave: true,

	//按键支持
    prefixkey: 'Ctrl+',

    //Before rendering the callback
    //渲染前回调
    viewbefore: function () {
		console.log(this);
    },

    //Markdown editor changes when callback
    //编辑器变动时回调
    input: function () {
        console.log(this);
    },

    //Trigger command callback
	//触发命令回调
    cmdcallback: function (cmd) {
        console.log(this);
    }
});
```

### Function 方法

```js
var nmd = new netnrmd('#editor');
console.log(nmd);

//focus 焦点选中
nmd.focus();

//set height 设置高度
nmd.height(200);

//toggle View 视图切换，默认2、1、3循环
nmd.toggleView();
//输入
nmd.toggleView(1);
//分屏
nmd.toggleView(2);
//预览
nmd.toggleView(3);

//set markdown 赋值
nmd.setmd(md);

//get markdown 取值
nmd.getmd();

//set html 赋值
nmd.sethtml(html);

//get html 取值
nmd.gethtml();

//render 渲染
nmd.render();

//hide 隐藏
nmd.hide();
//hide 工具条
nmd.hide('toolbar');

//show 显示
nmd.show();
//show 工具条
nmd.show('toolbar');

//set store 写入本地保存
nmd.setstore();

//get store 获取本地保存
nmd.getstore();
```