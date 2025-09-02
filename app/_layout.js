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
          options={{ title: "Profile", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="about"
          options={{ title: "About us", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="book"
          options={{ title: "Books", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="signup"
          options={{ title: "Register", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="signin"
          options={{ title: "Welcome", headerRight: () => <ThemeToggle /> }}
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
