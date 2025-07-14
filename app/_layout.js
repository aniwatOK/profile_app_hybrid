import { Stack } from "expo-router";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { StatusBar } from "react-native";

function StackLayout() {
  const { isDarkMode, toggleTheme, color } = useTheme();
  return (
    <>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: color.background,
          },
          headerTintColor: color.text,
          headerTitleStyle: {
            color: color.text,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "Profile", headerLeft: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="about"
          options={{ title: "About", headerLeft: () => <ThemeToggle /> }}
        />
      </Stack>
    </>
  );
}
export default function Layout() {
  return (
    <ThemeProvider>
      <StackLayout />
    </ThemeProvider>
  );
}
