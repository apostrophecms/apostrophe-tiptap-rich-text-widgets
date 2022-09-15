# Changelog

## 0.3.9 - 2022-09-15

* Fix a denial-of-service vulnerability by bumping xlsx package to its latest version.

## 0.3.8 - 2020-08-26

SanitizeHtml configuration is not mandatory on project level anymore.

## 0.3.7 - 2020-08-12

Table improvements:
- add header `<th></th>` on a row or a column with new buttons "Toggle Table Header Row" and "Toggle Table Header Column"
- highlight selected cells: previously, when selecting cells to merge them for example, they were not highlighted, leading to visual confusion
- merge cells fix: cells next to merged cells were aligned on the wrong column, under the merged cells. Now, original alignment is respected.

## 0.3.6

Actual release of fixes intended for 0.3.5, which did not include them due to a merge oversight:

Fixed bugs relating to importing a second table in a second widget on the same page, and also to adding a following widget right after a tiptap widget is imported as a table.

## 0.3.5

No changes due to merge oversight.

## 0.3.4

Adds Apostrophe standard Javascript linting.

## 0.3.3

Documentation clarification regarding running the build task (not something you need to worry about unless you are extending this module's capabilities). No code changes.

## 0.3.2

Import feature in public bundle.

## 0.3.1

Import featured documented in README.

## 0.3.0

Spreadsheet import button supporting Excel and CSV files. The imported spreadsheet becomes a table in your rich text widget, replacing all previous content in the widget. Thanks to Michelin for making this possible via [ApostropheCMS Enterprise Support](https://apostrophecms.com/support/enterprise-support).

## 0.2.0

You can now use this module in a subclass of `apostrophe-rich-text-widgets` by setting `tiptap: true` for that module, and `tiptap: false` for the standard `apostrophe-rich-text-widgets` module. This permits a mix of the two editors on a site, for instance for those who like the table editing of this module but are not ready to commit fully.

## 0.1.1

Clicking the Table button no longer unfocuses the editor.

## 0.1.0

Initial technology preview release. Good editor functionality, see stability notes.

