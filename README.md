## Requirements

You must use Node 8 or better.

## Installation

```
# First, cd to the root of your existing Apostrophe 2.x project

npm install apostrophe-tiptap-rich-text-editor-widgets
```

## Configuration

```javascript
// in app.js
require('apostrophe')({
  modules: {
    'apostrophe-tiptap-rich-text-editor-widgets': {}
  }
});
```

All rich text editor widgets on the site now use [tiptap](https://tiptap.scrumpy.io/) instead of CKEditor.

## Using your existing Vue install

```javascript
// in app.js
require('apostrophe')({
  pushVue: false,
  modules: {
    'apostrophe-tiptap-rich-text-editor-widgets': {}
  }
});
```

Normally this module will push Vue 2.x on the front end for the `user` scene (when users are logged in), as it is a requirement for tiptap to operate. You can prevent this by specifying `pushVue: false`. In this case, as a result of your own asset build, `window.Vue` must exist and must be Vue 2.x.

## Automatic rich text sanitization

Unlike the CKEditor-based editor module, this module automatically configures server-side rich text sanitization (`sanitizeHtml` configuration) based on the contents of your toolbar and styles option. There is no need to explicitly configure it.

## CKEditor-compatible toolbar configuration

tiptap and CKEditor are not the same and do not have identical features. Identical behavior is not guaranteed. However many common CKEditor toolbar options are accepted.

In addition, the following toolbar items are accepted natively:

`bold`
`italic`
`strike`
`link`
`horizontal_rule`
`bullet_list`
`ordered_list`
`blockquote`
`code_block`
`styles`

All of these require no configuration, with the exception of `styles`. The `styles` toolbar item, if present, must be configured via the `styles` option. It is used to provide a choice of block elements, potentially with a choice of CSS classes:

```javascript
styles: [
  // Default style must come first
  {
    tag: 'p',
    label: 'Paragraph'
  }
  {
    tag: 'h3',
    label: 'Heading'
  },
  {
    tag: 'h3',
    'class': 'right',
    label: 'Heading (Right)'
  }
]
```

**The `class` property may contain several space-separated classes.**

