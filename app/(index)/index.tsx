import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View } from "react-native";

const HomeScreen = () => {
  const { signOut } = useClerk();
  const router = useRouter();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // After successful logout, redirect to the auth screen
      router.replace("/(auth)");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <BodyScrollView contentContainerStyle={{ padding: 16 }}>
      <ThemedText type='title'>Home Screen</ThemedText>
      <Button onPress={handleSignOut}>Sign out</Button>
    </BodyScrollView>
  );
};

export default HomeScreen;
