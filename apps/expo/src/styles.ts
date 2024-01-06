// create a theme file that houses custom coolors

interface DefaultTheme {
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

export const theme: DefaultTheme = {
  colors: {
    primary: "#7B7FD8",
    secondary: "#2613FF",
    text: "#1E1E1E",
  },
};
