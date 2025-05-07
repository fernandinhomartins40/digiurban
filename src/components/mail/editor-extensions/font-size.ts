
import { Extension } from '@tiptap/core'

type FontSizeOptions = {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Set font size
       */
      setFontSize: (fontSize: string) => ReturnType
      /**
       * Unset font size
       */
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Extension.create<FontSizeOptions>({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize,
            renderHTML: attributes => {
              if (!attributes.fontSize) {
                return {}
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontSize: fontSize => ({ commands }) => {
        return commands.setMark('textStyle', { fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.setMark('textStyle', { fontSize: null })
      },
    }
  },
})
