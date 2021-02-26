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
  accent: '#FF7601',
  background: 'rgb(32, 32, 32)',
  primaryLight: '#DCDCDC', // Gainsboro
  primaryMedium: '#D3D3D3', // Light grey
  primaryDark: '#C0C0C0', // Silver
  browserBlue: 'rgb(0, 0, 238)',

  // Set aliases below
  bg: '',
  primary: '',
  primary0: '',
  primary1: '',
  primary2: '',
};
color.bg = color.background;
color.primary = color.primaryMedium;
color.primary0 = color.primaryLight;
color.primary1 = color.primaryMedium;
color.primary2 = color.primaryDark;

export const font = {
  body: 'Roboto, \'Segoe UI\', Tahoma, sans-serif;',
  head: 'Ubuntu, Roboto, \'Segoe UI\', Tahoma, sans-serif;',
  size: {
    small: '0.75rem', // 12px
    kindaSmall: '0.875rem', // 14px
    regular: '1rem', // 16px
    heading4: '1.25rem', // 20px
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
