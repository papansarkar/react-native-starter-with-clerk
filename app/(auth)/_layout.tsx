import { Redirect, router, Stack } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import useHeaderOptions from "@/hooks/useHeaderOptions";
import { getCustomTabsSupportingBrowsersAsync } from "expo-web-browser";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function AuthRoutesLayout() {
  const headerOptions = useHeaderOptions();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href='/(index)' />;

  return (
    <Stack screenOptions={headerOptions}>
      <Stack.Screen
        name='index'
        options={{ headerTitle: "Welcome back!", headerShown: false }}
      />

      <Stack.Screen
        name='sign-up'
        options={{
          headerTitle: () => null,
          headerTitleAlign: "left",
          headerBackVisible: false,
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_right",
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name='reset-password'
        options={{
          headerTitle: "Sign in",
          headerTitleAlign: "left",
          headerBackVisible: true,
          headerShown: true,
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
