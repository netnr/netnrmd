English | [简体中文](README_zh-CN.md)

# NetnrMD Editor
jQuery + Monaco Editor + Marked Parsing + DOMPurify Cleaning + highlight

> <https://md.netnr.com>

### [CHANGELOG](changelog.md)

### Install

<https://www.jsdelivr.com/package/npm/netnrmd>

```html
<div>
    <div id="editor">Loading ...</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs/loader.js"></script>

<link href="src/netnrmd.css" rel="stylesheet" />
<script src="src/netnrmd.js"></script>
<script src="src/netnrmd.extend.js"></script>

<script>
    require.config({
        paths: {
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/min/vs"
        },
        'vs/nls': { availableLanguages: { '*': 'zh-cn' } },
        mdrely: [
            'https://cdn.jsdelivr.net/npm/marked@1.2.0/lib/marked.min',
            'https://cdn.jsdelivr.net/npm/dompurify@2.1.1/dist/purify.min',
            'https://cdn.jsdelivr.net/npm/highlight.js@9.18.3/lib/highlight.min',
            'vs/editor/editor.main'
        ]
    });

    require(require.getConfig().mdrely, function (m, p, h) {
        window.marked = m;
        window.DOMPurify = p;
        window.hljs = h;

        //初始化
        window.nmd = new netnrmd('#editor');
    });
</script>
```

### Options

```js
var nmd = new netnrmd('#editor', {
	//View, 1 editor, 2 split screen, 3 preview, default 2
	viewmodel: 2

    //Editor font size
    fontsize: 16,

    height: 300,
	//Delay Parsing (ms)
    defer: 300,

    //Auto save key, default netnrmd_markdown, corresponding configuration is needed when there are multiple netnrmd editors on a page
	storekey: "key",
    //Changes are automatically saved by default
	autosave: true,

    prefixkey: 'Ctrl+',

    //Before rendering the callback
    viewbefore: function () {
		console.log(this);
    },

    //Markdown editor changes when callback
    input: function () {
        console.log(this);
    },

    //Trigger command callback
    cmdcallback: function (cmd) {
        console.log(this);
    }
});
```

### Function

```js
var nmd = new netnrmd('#editor');
console.log(nmd);

//Focus editor
nmd.focus();

//set height
nmd.height(200);

//View switching, default 2, 1, 3 cycle
nmd.toggleView();
//View editor
nmd.toggleView(1);
//View editor and preview
nmd.toggleView(2);
//View preview
nmd.toggleView(3);

//set markdown
nmd.setmd(md);

//get markdown
nmd.getmd();

//set html
nmd.sethtml(html);

//get html
nmd.gethtml();

//render
nmd.render();

//hide
nmd.hide();
//hide toolbar
nmd.hide('toolbar');

//show
nmd.show();
//show toolbar
nmd.show('toolbar');

//set localStorage
nmd.setstore();

//get localStorage
nmd.getstore();
```