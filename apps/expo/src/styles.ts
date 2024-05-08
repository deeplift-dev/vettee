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
    primary: "##09090b",
    secondary: "#2613FF",
    text: "#1E1E1E",
  },
};
