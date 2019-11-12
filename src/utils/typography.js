import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '16px',
  baseLineHeight: 1,
  headerFontFamily: ['Nunito Sans', 'Tahoma', 'sans-serif'],
  bodyFontFamily: ['Nunito Sans', 'Tahoma', 'sans-serif'],
  overrideStyles: () => ({
    h1: {
      fontWeight: 700,
    },
  }),
});

export default typography;
