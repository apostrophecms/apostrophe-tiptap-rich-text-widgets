## Why?

Many users of ApostropheCMS are aware of our plans to use the Vue-based [Tiptap](https://tiptap.scrumpy.io/) editor in Apostrophe 3.x. This module provides an early technology preview of that editor for Apostrophe 2.x. When present it replaces the CKEditor 4.x-based rich text editing experience that ships with ApostropheCMS.

## Requirements

You must use Node 8 or better.

## Installation

```
# First, cd to the root of your existing Apostrophe 2.x project. Then...

npm install apostrophe-tiptap-rich-text-widgets
```

## Configuration

```javascript
// in app.js
require('apostrophe')({
  modules: {
    'apostrophe-tiptap-rich-text-widgets': {}
  }
});
```

All rich text editor widgets on the site now use [tiptap](https://tiptap.scrumpy.io/) instead of CKEditor.

## CKEditor-compatible toolbar configuration

tiptap and CKEditor are not the same and do not have identical features. Identical behavior is not guaranteed. However many common CKEditor toolbar options are accepted.

## Native tiptap toolbar configuration

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
  // If you do not include any `p` styles, one will be added for you, as
  // tiptap/prosemirror inserts paragraphs in several situations.
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

**The `class` property may contain several space-separated class names.**

> The `name` and `element` properties are accepted as fallbacks for `label` and `tag`, for backwards compatibility.

## Adding more tiptap extensions

You can write your own tiptap extensions, either at project level in `lib/modules/apostrophe-rich-text-widgets/src/apos/extensions`, or in an npm module that also uses `improve` to enhance `apostrophe-rich-text-widgets` and is configured *after* this module. These extensions will be autoloaded if present.

Similarly you can write your own Vue components to provide UI for those extensions in `src/apos/components`.

See the existing `src/apos/extensions` and `src/apos/components` folders of this module for examples.

If you add extensions, you must run this task to rebuild the frontend JavaScript code:

```
node app apostrophe-rich-text-widgets:build
```

This will create the file:

```
lib/modules/apostrophe-rich-text/public/js/public-tiptap-bundle.js
```

And that will become part of the assets pushed to your browser from this point on. You should commit it and deploy it as you would any source file. If you decide you don't want any custom extensions after all, you should remoe it.

## Contributing to this module

Feel free! Be aware that if you add or modify Vue components and extensions in the npm module itself, you will need to run:

```
node app apostrophe-rich-text-widgets:build --npm
```

Otherwise the asset bundle is built at project level. Note that when you use `--npm` project-level extensions and components are *not* included in the bundle, since their source code won't be there for anyone else who installs the module.

> **If you have a project-level `lib/modules/apostrophe-rich-text-widgets/public/js/project-tiptap-bundle.js` file, that will get loaded instead when you run `node app`, so make sure you remove that to test your build.**

