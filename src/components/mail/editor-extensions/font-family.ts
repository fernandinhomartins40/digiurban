
import { Extension } from '@tiptap/core'

type FontFamilyOptions = {
  types: string[]
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      /**
       * Set font family
       */
      setFontFamily: (fontFamily: string) => ReturnType
      /**
       * Unset font family
       */
      unsetFontFamily: () => ReturnType
    }
  }
}

export const FontFamily = Extension.create<FontFamilyOptions>({
  name: 'fontFamily',

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
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily,
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {}
              }

              return {
                style: `font-family: ${attributes.fontFamily}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setFontFamily: fontFamily => ({ commands }) => {
        return commands.setMark('textStyle', { fontFamily })
      },
      unsetFontFamily: () => ({ commands }) => {
        return commands.setMark('textStyle', { fontFamily: null })
      },
    }
  },
})
