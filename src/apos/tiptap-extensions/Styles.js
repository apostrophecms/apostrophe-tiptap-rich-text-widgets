import { Node } from 'tiptap';
import {
  setBlockType
} from 'tiptap-commands';

export default class Styles extends Node {

  get name() {
    return 'styles';
  }

  get schema() {
    return {
      attrs: {
        tag: {
          default: this.relevantStyles()[0].tag
        },
        class: {
          default: this.relevantStyles()[0].class || null
        }
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,

      parseDOM: (this.relevantStyles()).map(style => {
        return {
          tag: style.class ? `${style.tag}[class="${style.class}"]` : `${style.tag}:not([class])`,
          attrs: {
            tag: style.tag,
            class: style.class
          }
        };
      }),

      toDOM: node => {
        const attrs = {
          class: node.attrs.class || null
        };

        return [node.attrs.tag, attrs, 0];
      }

    };
  }

  commands({ type, schema }) {
    return attrs => {
      attrs = {
        tag: attrs.tag,
        class: attrs.class || null
      };
      return setBlockType(type, attrs);
    };
  }

  relevantStyles() {
    return (this.options.styles || []).filter(style => (style.tag !== 'p'));
  }

  // keys({ type }) {
  //   return this.options.levels.reduce((items, level) => ({
  //     ...items,
  //     ...{
  //       [`Shift-Ctrl-${level}`]: setBlockType(type, { level }),
  //     },
  //   }), {})
  // }

  // inputRules({ type }) {
  //   return this.options.levels.map(level => textblockTypeInputRule(
  //     new RegExp(`^(#{1,${level}})\\s$`),
  //     type,
  //     () => ({ level }),
  //   ))
  // }

}
