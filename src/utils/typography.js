import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '14px',
  baseLineHeight: 1,
  // headerFontFamily: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  // bodyFontFamily: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  headerFontFamily: ['Arial', 'sans-serif'],
  bodyFontFamily: ['Arial', 'sans-serif'],
  overrideStyles: () => ({
    h1: {
      fontWeight: 100,
    },
  }),
});

export default typography;
