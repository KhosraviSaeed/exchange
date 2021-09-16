let breakpoints = ["468px", "769px", "1024px", "1368px"];
breakpoints.mobile = breakpoints[0];
breakpoints.tablet = breakpoints[1];
breakpoints.compact_desktop = breakpoints[2];
breakpoints.desktop = breakpoints[3];

export default {
  colors: {
    background: {
      main: "#5a5a5a;"
    },
    primary: {
      main: "#232323",
      gradient: "linear-gradient(#fff8bd 100%, #fdffa6 100%, #ffeba0 97.23%, #ffd023 93%, #fffeae 96.54%, #fff7b0 99.66%, #f4ca2d 99%, #f4ca2d 99%)",
      light: "#4c5ebb"
    },
    hr: {
      main: '#827e7e'
    },
    sidBarIcon: {
      gradient: 'linear-gradient(180deg, rgba(255, 247, 176, 0.9966) 3.65%, rgba(255, 254, 174, 0.9654) 14.06%, rgba(252, 236, 155, 0.854082) 27.6%, rgba(255, 234, 158, 0.9723) 38.54%, rgba(255, 215, 68, 0.93) 58.33%, rgba(255, 203, 11, 0.97) 82.81%, #D07F06 100%)'
    },
    oLine: {
      1: 'linear-gradient(rgba(255, 240, 173, 0.9725), rgba(255, 216, 73, 0.9075), rgba(242, 236, 182, 1), rgba(222, 186, 29, 0.94), rgba(87, 55, 13, 0.03)',
      2 : 'linear-gradient(180deg, rgba(255, 247, 176, 0.9966) 3.65%, rgba(255, 254, 174, 0.9654) 14.06%, rgba(252, 236, 155, 0.854082) 27.6%, rgba(255, 234, 158, 0.9723) 38.54%, rgba(255, 215, 68, 0.93) 58.33%, rgba(255, 203, 11, 0.97) 82.81%, #D07F06 100%)'
    },
    success: {
      main: "#2fad66",
      gradient: "linear-gradient(65deg, #2fad66 15%, #9de686 133%)"
    },
    error: {
      main: "#e35f4b",
      gradient: "linear-gradient(to bottom, #f38282, #e35f4b);"
    },
    text: {
      main: "#364551",
      secondary: "rgba(0, 0, 0, 0.7)",
      hint: "#777777"
    },
    common: {
      black: "#000",
      white: "#fff"
    },
    transparent: "transparent",
    borders: {
      main: "#dbe0e6",
      primaryLight: "#6573d6"
    },
    action: {
      disabled: "rgba(0, 0, 0, 0.26)",
      disabledBackground: "rgba(0, 0, 0, 0.12)"
    },
    footer: {
      firstRow : "#232f3e",
      secodndRow : "#999999"
    },
    social : {
      gradient: "linear-gradient(to top, #e5e5e5, #ffffff);"

    }
  },
  space: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 70, 80, 85],
  imageSize: [24, 36, 48, 64, 128, 256],
  fontSizes: {
    xxs: 8,
    xs: 10,
    xms: 13,
    s: 14,
    sm: 15,
    m: 16,
    xm: 20,
    l: 24,
    lxl: 25,
    xl: 32,
    xxl: 40,
    xxxl: 64,
    xxxxl: 82
  },
  radii: {
    xs: 4,
    s: 6,
    m: 8,
    l: 16,
    xl: 25,
    xxl: 30,
    circle: "100px"
  },
  containerWidth: 1100,
  breakpoints
};
