import { Node } from 'tiptap';
import {
  setBlockType
} from 'tiptap-commands';

export default class Paragraph extends Node {

  get name() {
    return 'paragraph'
  }

  get schema() {
    return {
      attrs: {
        class: {
          default: (this.relevantStyles()[0] && this.relevantStyles()[0].class) || null
        }
      },
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: this.relevantStyles().map(style => {
        return {
          tag: style.class ? `p[class="${style.class}"]` : `p:not([class])`,
          attrs: {
            class: style.class || null
          }
        };
      }),
      toDOM: node => {
        const attrs = {
          class: node.attrs.class || null
        };

        return [ 'p', attrs, 0 ];
      }
    }
  }

  commands({ type, schema }) {
    return attrs => {
      attrs = {
        class: attrs.class || null
      };
      return setBlockType(type, attrs);
    };
  }

  relevantStyles() {
    const styles = this.options.styles || [];
    return styles.filter(style => (style.tag === 'p'));
  }
}

