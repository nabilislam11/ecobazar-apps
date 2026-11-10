import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";

import { useColorScheme } from "react-native";

import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <CartProvider>
        <WishlistProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
