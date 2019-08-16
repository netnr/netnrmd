# netnrmd编辑器

> Monaco Editor 编辑器 + Marked 解析 + highlight 代码高亮

> <https://md.netnr.com>

### Install 安装

```html
<div>
    <div id="editor"></div>
</div>

<!--jquery-->
<script src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>

<!--marked 解析器（自定义render方法，可不引入）-->
<script src="https://lib.baomitu.com/marked/0.7.0/marked.min.js"></script>

<!--Monaco Editor 加载器-->
<script src="https://code.bdstatic.com/npm/monaco-editor@0.17.0/min/vs/loader.js"></script>

<!--highlight 代码高亮（可选）-->
<script src="https://lib.baomitu.com/highlight.js/9.12.0/highlight.min.js" defer async></script>

<!--netnrmd-->
<link href="netnrmd.css" rel="stylesheet" />
<script src="netnrmd.js"></script>

<!--构建-->
<script>
    require.config({
        paths: { vs: "https://code.bdstatic.com/npm/monaco-editor@0.17.0/min/vs" },
        'vs/nls': { availableLanguages: { '*': 'zh-cn' } }
    });

    require(['vs/editor/editor.main'], function () {
        //初始化 netnrmd
        window.nmd = new netnrmd('#editor');

        //高度沉底
        $(window).on('load resize', function () {
            var vh = $(window).height() - nmd.obj.container.offset().top - 15;
            nmd.height(Math.max(100, vh));
        })
    });
</script>
```

### Options 选项

```js
var nmd = new netnrmd('#editor', {
	//视图,1输入，2分屏，3预览，默认2
	viewmodel: 2

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

    //解析器，默认使用marked
    //指定解析方式，返回解析后的HTML
    render: function (md) {
        console.log(md)
        return md;
    },

    //自定义工具栏
    items: [
        {
			//title
            title: '表情',
			//keyboard
            key: 'E',
			//cmd (default icon) 
            cmd: 'emoji',
            //矢量图标，path标签 d特性值
            svg: ''
        }
    ],

    //Before rendering the callback, add an expression Icon
    //渲染前回调，添加一个表情图标
    viewbefore: function () {
		console.log(this);

        this.items.splice(0, 0, {
            title: '表情',
            key: 'E',
            cmd: 'emoji'
        });
    },

    //Markdown editor changes when callback, custom parsing, add: emoji: parsing
    //编辑器变动时回调，自定义解析，添加 :emoji: 解析
    input: function () {
        //markdown to html
		//获取markdown解析为html
        var htm = this.md.render(this.getmd());

        //:emoji:
        //emojiParse自己实现
        htm = emojiParse(htm);

        //赋值视图
        //set html
        this.sethtml(htm);

        //Prevent internal rendering		
        //阻止内部渲染 
        return false;
    },

    //Trigger command callback
	//触发命令回调
    cmdcallback: function (cmd) {
        if (cmd == "emoji") {
            $('#myModalEmoji').modal();
        }
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

//clear markdown&html 清空
nmd.clear();

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