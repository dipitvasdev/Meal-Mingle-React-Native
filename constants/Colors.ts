/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#fcd34d";
const tintColorDark = "#b45309";

export const Colors = {
  light: {
    text: "black",
    background: "#fcd34d",
    tint: tintColorLight,
    icon: "black",
    tabIconDefault: "black",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "white",
    background: "#b45309",
    tint: tintColorDark,
    icon: "black",
    tabIconDefault: "black",
    tabIconSelected: tintColorDark,
  },
};
