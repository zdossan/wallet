import { Stack } from "expo-router";
import SafeScreen from "../components/safeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreen>
  );
}

