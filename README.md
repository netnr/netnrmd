# netnrmd

> Markdown Combinatorial editor | 组合编辑器

> markdown 语法解析基于 `remarkable` ，编辑与解析分离

> 调用任意 markdown 解析器都能完美的运行

> <https://md.netnr.com>

## Install 安装

```js
//font-awesome （可以修改样式，用图片代替）
<link href="https://lib.baomitu.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

//jquery
<script src="https://lib.baomitu.com/jquery/1.12.4/jquery.min.js"></script>

//remarkable 默认解析器（自定义render方法，可不引入）
<script src="https://lib.baomitu.com/remarkable/1.7.1/remarkable.js"></script>

//netnrmd 样式
<link href="netnrmd.css" rel="stylesheet" />
//netnrmd
<script src="netnrmd.min.js"></script>

//highlight 代码高亮（可选）
<script src="https://lib.baomitu.com/highlight.js/9.12.0/highlight.min.js"></script>
```


## Usage 使用

```js
var nmd = new netnrmd('#txt');
console.log(nmd);
console.log($('#txt').data('netnrmd'));

//nmd.obj	参数
//nmd.md	默认remarkable解析器对象
```

## Documentation 文档

> [remarkable demo](https://jonschlinkert.github.io/remarkable/demo/)

### Options 选项

```js
var nmd = new netnrmd('#txt', {
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

	//矢量图标前缀，font-awesome
    prefixicon: 'fa fa-',
	//按键支持
    prefixkey: 'Ctrl+',

    //解析器，默认使用remarkable，需要引入remarkable
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
			//icon
            icon: 'smile-o',
			//keyboard
            key: 'E',
			//cmd (default icon) 
            cmd: 'emoji'
        },
        {
            title: '粗体',
            icon: 'bold',
            key: 'B'
        }
    ],

    //Before rendering the callback, add an expression Icon
    //渲染前回调，添加一个表情图标
    viewbefore: function () {
		console.log(this);

        this.items.splice(0, 0, {
            title: '表情/emoji',
            icon: 'smile-o',
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

//default remarkable parse，默认解析方式
console.log(nmd.md.render('# netnrmd!'));
// => <h1>netnrmd!</h1>
```

### Function 方法

```js
var nmd = new netnrmd('#txt');
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

//插入内容 重要，控制文本域的操作
var ops = {
	//不为空即可
	cmd: cmdname,
	//文本域对象
    txt: nmd.obj.textarea[0],
	//插入的内容前缀
    before: '**',
	//未选中内容时，默认内容，会选中
    defaultvalue: '加粗',
	//插入的内容后缀
    after: '**'
};
netnrmd.insertxt(ops);
//有选中内容XXX，输出：**XXX**
//未选择内容，输出：**加粗**
//before 到 after 之间的内容会选中
```
### Textarea Extend 文本域拓展 

```js
var txtDom = $('#txt')[0];

//获取光标位置
netnrmd.getCursortPosition(txtDom);

//设置光标位置
netnrmd.getCursortPosition(txtDom, 3);

//获取选中文字
netnrmd.getSelectText(txtDom);

//选中特定范围的文本
netnrmd.setSelectText(txtDom, 1, 3);

//在光标后插入文本
netnrmd.insertAfterText(txtDom, "text");
```

## Authors 作者

- [netnr](https://www.netnr.com) [github/netnr](https://github.com/netnr) 
- Jon Schlinkert [github/jonschlinkert](https://github.com/jonschlinkert)
