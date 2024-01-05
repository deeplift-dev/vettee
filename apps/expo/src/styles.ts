// create a theme file that houses custom coolors

interface DefaultTheme {
  colors: {
    primary: string;
    text: string;
  };
}

export const theme: DefaultTheme = {
  colors: {
    primary: "#8EFF79",
    text: "#1E1E1E",
  },
};
