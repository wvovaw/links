import { definePreset } from "unocss";

interface PresetMoonOptions {
}
export default definePreset((_options?: PresetMoonOptions) => {
  return {
    name: "@links/ui-preset",
    theme: {
      colors: {
        piccolo: {
          DEFAULT: "var(--piccolo)",
        },
        hit: {
          DEFAULT: "var(--hit)",
        },
        beerus: {
          DEFAULT: "var(--beerus)",
        },
        goku: {
          DEFAULT: "var(--goku)",
        },
        gohan: {
          DEFAULT: "var(--gohan)",
        },
        bulma: {
          DEFAULT: "var(--bulma)",
        },
        trunks: {
          DEFAULT: "var(--trunks)",
        },
        goten: {
          DEFAULT: "var(--goten)",
        },
        popo: {
          DEFAULT: "var(--popo)",
        },
        jiren: {
          DEFAULT: "var(--jiren)",
        },
        jira: {
          DEFAULT: "var(--jira)",
        },
        heles: {
          DEFAULT: "var(--heles)",
        },
        zeno: {
          DEFAULT: "var(--zeno)",
        },
        // special colors
        progress: {
          DEFAULT: "var(--progress)",
        },
        // support colours
        krillin: {
          DEFAULT: "var(--krillin)",
          60: "var(--krillin-60)",
          10: "var(--krillin-10)",
        },
        chichi: {
          DEFAULT: "var(--chichi)",
          60: "var(--chichi-60)",
          10: "var(--chichi-10)",
        },
        roshi: {
          DEFAULT: "var(--roshi)",
          60: "var(--roshi-60)",
          10: "var(--roshi-10)",
        },
        dodoria: {
          DEFAULT: "var(--dodoria)",
          60: "var(--dodoria-60)",
          10: "var(--dodoria-10)",
        },
        cell: {
          DEFAULT: "var(--cell)",
          60: "var(--cell-60)",
          10: "var(--cell-10)",
        },
        raditz: {
          DEFAULT: "var(--raditz)",
          60: "var(--raditz-60)",
          10: "var(--raditz-10)",
        },
        whis: {
          DEFAULT: "var(--whis)",
          60: "var(--whis-60)",
          10: "var(--whis-10)",
        },
        frieza: {
          DEFAULT: "var(--frieza)",
          60: "var(--frieza-60)",
          10: "var(--frieza-10)",
        },
        nappa: {
          DEFAULT: "var(--nappa)",
          60: "var(--nappa-60)",
          10: "var(--nappa-10)",
        },
      },
      borderRadius: {
        "moon-i-xs": "var(--radius-i-xs)",
        "moon-i-sm": "var(--radius-i-sm)",
        "moon-i-md": "var(--radius-i-md)",
        "moon-s-xs": "var(--radius-s-xs)",
        "moon-s-sm": "var(--radius-s-sm)",
        "moon-s-md": "var(--radius-s-md)",
        "moon-s-lg": "var(--radius-s-lg)",
      },
      zIndex: {
        1: "1",
        5: "5",
        10000: "10000",
      },
      boxShadow: {
        "moon-xs": "var(--shadow-xs)",
        "moon-sm": "var(--shadow-sm)",
        "moon-md": "var(--shadow-md)",
        "moon-lg": "var(--shadow-lg)",
        "moon-xl": "var(--shadow-xl)",
        // TODO: This doesn't work well with UNOCSS, use this values as arbituary instead
        // "inset": "0 0 0 1px inset var(--piccolo)",
        // "interactive": "0 0 0 2px inset",
        // "focus": `0 0 0 4px rgba(var(--piccolo), .13)`,
        // "left": `var(--beerus) -6px 0px 9px -10px`,
        // "input": "0 0 0 var(--border-width) var(--beerus) inset",
        // "input-hov": "0 0 0 var(--border-i-width) rgb(var(--bulma) / 7%) inset, 0 0 0 var(--border-i-width) rgb(var(--beerus)) inset",
        // "input-err": "0 0 0 var(--border-i-width) var(--chichi) inset",
        // "input-focus": "0 0 0 var(--border-i-width) var(--piccolo) inset",
        // "input-cell-focus": "0 0 0 var(--border-width) var(--bulma) inset",
        // "textarea": "0 0 0 var(--border-width) var(--beerus)",
        // "textarea-hov": "0 0 0 var(--border-i-width) rgb(var(--bulma) / 7%), 0 0 0 var(--border-i-width) rgb(var(--beerus))",
        // "textarea-focus": "0 0 0 var(--border-i-width) var(--piccolo)",
        // "textarea-err": "0 0 0 var(--border-i-width) var(--chichi)",
      },
      opacity: {
        moon: "var(--opacity-moon)",
      },
      fontFamily: {
        "averta":
          "var(--averta), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif",
        "dm-sans":
          "var(--dm-sans), -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif",
      },
      fontSize: {
        "moon-9": [
          "0.5625rem",
          {
            "line-height": "1rem",
          },
        ],
        "moon-9-caption": [
          "0.5625rem",
          {
            "line-height": "1rem",
            "letter-spacing": "0.0625rem",
          },
        ],
        "moon-10": [
          "0.625rem",
          {
            "line-height": "1rem",
          },
        ],
        "moon-10-caption": [
          "0.625rem",
          {
            "line-height": "1rem",
            "letter-spacing": "0.0313rem",
          },
        ],
        "moon-12": [
          "0.75rem",
          {
            "line-height": "1rem",
          },
        ],
        "moon-14": [
          "0.875rem",
          {
            "line-height": "1.5rem",
          },
        ],
        "moon-16": [
          "1rem",
          {
            "line-height": "1.5rem",
          },
        ],
        "moon-18": [
          "1.125rem",
          {
            "line-height": "1.5rem",
          },
        ],
        "moon-20": [
          "1.25rem",
          {
            "line-height": "2rem",
          },
        ],
        "moon-24": [
          "1.5rem",
          {
            "line-height": "2rem",
          },
        ],
        "moon-32": [
          "2rem",
          {
            "line-height": "2.5rem",
            "letter-spacing": "-0.03125rem",
          },
        ],
        "moon-40": [
          "2.5rem",
          {
            "line-height": "3rem",
            "letter-spacing": "-0.03125rem",
          },
        ],
        "moon-48": [
          "3rem",
          {
            "line-height": "3.5rem",
            "letter-spacing": "-0.0625rem",
          },
        ],
        "moon-56": [
          "3.5rem",
          {
            "line-height": "4rem",
            "letter-spacing": "-0.09375rem",
          },
        ],
        "moon-64": [
          "4rem",
          {
            "line-height": "4.5rem",
            "letter-spacing": "-0.125rem",
          },
        ],
        "moon-72": [
          "4.5rem",
          {
            "line-height": "4.75rem",
            "letter-spacing": "-0.15625rem",
          },
        ],
      },
      fontWeight: {
        regular: "400",
        semibold: "600",
      },
      animation: {
        keyframes: {
          "error": "{ 10%, 90% { transform: translate3d(-1px, 0, 0) } 20%, 80% { transform: translate3d(2px, 0, 0) } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0) } 40%, 60% { transform: translate3d(4px, 0, 0) } }",
          "explode": "{ 0% { transform: translate(-50%, -50%) scale(0); opacity: 1 } 50% { transform: translate(-50%, -50%) scale(1); opacity: 0.4 } 80%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0 } }",
          "rotation": "{ 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }",
          "pulse2": "{ 10%, 90% { transform: translate3d(-1px, 0, 0) } 0% { transform: scale(1) } 70% { transform: scale(1); box-shadow: 0 0 0 30px transparent } 100% { transform: scale(1); box-shadow: 0 0 0 0 transparent } }",
          // Collapsible
          "collapsible-down": "{ from { height: 0 } to { height: var(--radix-collapsible-content-height) } }",
          "collapsible-up": "{ to { height: 0 } from { height: var(--radix-collapsible-content-height) } }",
          // Accordion
          "accordion-down": "{ from { height: 0 } to { height: var(--radix-accordion-content-height) } }",
          "accordion-up": "{ to { height: 0 } from { height: var(--radix-accordion-content-height) } }",
          // Toast
          "toast-hide": "{ 0% { opacity: 1 } 100% { opacity: 0 } }",
          "toast-slide-in-right": "{ 0% { transform: translateX(calc(100% + 1rem)) } 100% { transform: translateX(0) } }",
          "toast-slide-in-left": "{ 0% { transform: translateX(calc(-100% + 1rem)) } 100% { transform: translateX(0) } }",
          "toast-slide-in-down": "{ 0% { transform: translateY(calc(100% + 1rem)) } 100% { transform: translateY(0) } }",
          "toast-slide-in-up": "{ 0% { transform: translateY(calc(-100% + 1rem)) } 100% { transform: translateY(0) } }",
          "toast-swipe-out": "{ 0% { transform: translateX(var(--radix-toast-swipe-end-x)) } 100% { transform: translateX(100%) } }",
        },
        durations: {
          "pulse2": "1.5s",
          "error": ".82s",
          // Collapsible
          "collapsible-down": "0.2s",
          "collapsible-up": "0.2s",
          // Accordion
          "accordion-down": "0.2s",
          "accordion-up": "0.2s",
          // Toast
          "toast-hide": "250ms",
          "toast-slide-in-right": "250ms",
          "toast-slide-in-left": "250ms",
          "toast-slide-in-down": "250ms",
          "toast-slide-in-up": "250ms",
          "toast-swipe-out": "100ms",
        },
        counts: {
          pulse2: "infinite",
          error: "1",
        },
        fillMode: {
          error: "both",
        },
        timingFns: {
          "pulse2": "ease-out",
          "error": "cubic-bezier(.36,.07,.19,.97)",
          // Collapsible
          "collapsible-down": "ease-in-out",
          "collapsible-up": "ease-in-out",
          // Accordion
          "accordion-down": "ease-out",
          "accordion-up": "ease-out",
          // Toast
          "toast-hide": "ease-in forwards",
          "toast-slide-in-right": "cubic-bezier(0.16, 1, 0.3, 1)",
          "toast-slide-in-left": "cubic-bezier(0.16, 1, 0.3, 1)",
          "toast-slide-in-down": "cubic-bezier(0.16, 1, 0.3, 1)",
          "toast-slide-in-up": "cubic-bezier(0.16, 1, 0.3, 1)",
          "toast-swipe-out": "ease-out forwards",
        },
      },
    },
  };
});
