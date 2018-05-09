# netnrmd

> Markdown Combinatorial editor | 组合编辑器

> <https://md.netnr.com>

## Install 安装

```
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
<link href="https://lib.baomitu.com/highlight.js/9.12.0/styles/github.min.css" rel="stylesheet">
<script src="https://lib.baomitu.com/highlight.js/9.12.0/highlight.min.js"></script>
```


## Usage 使用

```js
var nmd = new netnrmd('#txt');
console.log(nmd);
```

## Documentation 文档

> [remarkable demo](https://jonschlinkert.github.io/remarkable/demo/)

### Options 选项

```js
var nmd = new netnrmd('#txt',{
	fullscreen: false,		//全屏
	splitscreen: true,		//分屏
	height: 300,			//高度
	defer: 300,				//延迟解析（毫秒）
	prefixicon: 'fa fa-',	//矢量图标前缀，font-awesome
	prefixkey: 'Ctrl+',		//按键支持
	//解析器，默认使用remarkable，需要引入remarkable
	//指定解析方式，返回解析后的HTML
	render: function(md){
		console.log(md)
		return md;
	},
	//工具栏
	items:[
		{
			title: '表情',		//title
			icon: 'smile-o',	//icon
			key: 'E',			//keyboard
			cmd: 'emoji'		//cmd (default icon) 
		},
		{
			title: '粗体',
			icon: 'bold',
			key: 'B'
		}
	]
});

//default remarkable parse，默认解析方式
console.log(nmd.md.render('# Remarkable rulezz!'));
console.log(md.render('# Remarkable rulezz!'));
// => <h1>Remarkable rulezz!</h1>
```

### Function 方法

```js
var nmd = new netnrmd('#txt');
console.log(nmd);

//set height 设置高度
nmd.height(200);

//toggle Full Screen 切换全屏
nmd.toggleFullScreen();
nmd.toggleFullScreen(true);
nmd.toggleFullScreen(false);

//toggle Split Screen 切换分屏
nmd.toggleSplitScreen();
nmd.toggleSplitScreen(true);
nmd.toggleSplitScreen(false);

//toggle Preview 预览切换
nmd.togglePreview();
nmd.togglePreview(true);
nmd.togglePreview(false);

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
```

## Authors 作者

- [netnr](https://www.netnr.com) [github/netnr](https://github.com/netnr) 
- Jon Schlinkert [github/jonschlinkert](https://github.com/jonschlinkert)
