export { breakpoint, space, color, fz, imageSize };

function breakpoint(name) {
  return function getBreakpoint(props) {
    return props.theme.breakpoints[name];
  };
}

function space(num) {
  return function getSpace(props) {
    return props.theme.space[num];
  };
}

function color(name) {
  return function getColor(props) {
    let paths = name.split(".");
    let val = paths.reduce((prev, current) => {
      return prev[current];
    }, props.theme.colors);
    return val;
  };
}

function fz(name) {
  return function getFontSize(props) {
    return props.theme.fontSizes[name];
  };
}

function imageSize(num) {
  return function getImageSize(props) {
    return props.theme.imageSize[num];
  };
}
