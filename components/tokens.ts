// These breakpoints are based on [Tailwind's defaults][1]
// [1]: https://tailwindcss.com/docs/breakpoints

export const maxWidth = {
  medium: 768,
  large: 1024,
};

export const breakpoint = {
  medium: `@media screen and (min-width: ${maxWidth.medium + 1}px)`,
  large: `@media screen and (min-width: ${maxWidth.large + 1}px)`,
};

export const color = {
  text: '#424242',
  background: '#fff6de', // "cream"
  browserBlue: 'rgb(0, 0, 238)',

  // Set aliases below
  bg: '',
};
color.bg = color.background;

export const font = {
  body: '"EB Garamond 500", serif',
  head: '"EB Garamond", serif',
  size: {
    xtraSmall: '0.75rem', // 12px
    small: '1rem', // 16px
    regular: '1.25rem', // 20px
    heading3: '1.5rem', // 24px
    heading2: '1.75rem', // 28px
    heading1: '2rem', // 32px
    title: '2.5rem', // 40px
  },
};

// This scale is based on [Tailwind's default spacing scale][2]
// [2]: https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
export const space = {
  nano: '0.0625rem',
  micro: '0.125rem',
  xtraSmall: '0.25rem',
  small: '0.5rem',
  mediumSmall: '0.75rem',
  medium: '1rem',
  mediumLarge: '1.25rem',
  large: '1.5rem',
  xtraLarge: '2rem',
  kilo: '2.5rem',
  mega: '3rem',
  giga: '4rem',
  tera: '5rem',
  peta: '6rem',

  // Aliases set below
  half: '',
  xs: '',
  sm: '',
  ms: '',
  md: '',
  ml: '',
  lg: '',
  xl: '',
};
space.half = space.small;
space.xs = space.xtraSmall;
space.sm = space.small;
space.ms = space.mediumSmall;
space.md = space.medium;
space.ml = space.mediumLarge;
space.lg = space.large;
space.xl = space.xtraLarge;

export const z = {
  backdrop: 1000,
  menu: 1001,
  top: 900,
};
