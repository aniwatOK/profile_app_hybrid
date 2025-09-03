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
          options={{ title: "HOME", headerRight: () => <ThemeToggle /> }}
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
          options={{ title: "Sign Up", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="signin"
          options={{ title: "Sign In", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="profile"
          options={{ title: "Profile", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="book_detail"
          options={{ title: "Detail", headerRight: () => <ThemeToggle /> }}
        />
        <Stack.Screen
          name="book_new"
          options={{ title: "New Books", headerRight: () => <ThemeToggle /> }}
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
