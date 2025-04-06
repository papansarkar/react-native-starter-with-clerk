import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View } from "react-native";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/tex-input";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { ClerkAPIError } from "@clerk/types";

const SignInScreen = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setIsSigningIn(true);
    setErrors([]);

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/(index)");
      } else {
        // Handle additional steps if needed (like 2FA)
        console.log("Additional authentication steps required:", result);
      }
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        // If it's not a structured Clerk error, create a generic one
        setErrors([
          {
            code: "unknown",
            message: "An error occurred during sign in",
            longMessage: typeof error === 'object' && error !== null && 'message' in error 
              ? String(error.message) 
              : "Please try again later",
          },
        ]);
      }
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  }, [isLoaded, emailAddress, password, signIn, setActive, router]);

  return (
    <View style={styles.container}>
      <BodyScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <ThemedText type='title' style={styles.header}>
            Sign In
          </ThemedText>

          <TextInput
            label='Email'
            value={emailAddress}
            placeholder='Enter Email'
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={setEmailAddress}
          />
          <TextInput
            label='Password'
            value={password}
            placeholder='Enter Password'
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
          <Button
            onPress={onSignInPress}
            loading={isSigningIn}
            disabled={isSigningIn || !password || !emailAddress}
          >
            Sign in
          </Button>

          {errors && errors.length > 0 && (
            <View style={{ marginVertical: 10 }}>
              {errors.map((error) => (
                <ThemedText 
                  key={error.longMessage || error.message} 
                  style={{ 
                    color: "red",
                    textAlign: "center",
                    marginTop: 8
                  }}
                >
                  {error.longMessage || error.message}
                </ThemedText>
              ))}
            </View>
          )}
        </View>
      </BodyScrollView>

      <View style={styles.bottomContainer}>
        <View>
          <ThemedText style={[{ alignSelf: "center" }]}>
            Don't have an account?
          </ThemedText>
          <Button variant='ghost' onPress={() => router.push("/sign-up")}>
            Sign up
          </Button>
        </View>
        <View>
          <ThemedText style={[{ alignSelf: "center" }]}>
            Forgot Password?
          </ThemedText>
          <Button
            variant='ghost'
            onPress={() => router.push("/reset-password")}
          >
            Reset Password
          </Button>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 30,
    paddingBottom: 100, // Add padding at the bottom to prevent content from being hidden behind the bottom container
  },
  header: {
    alignSelf: "center",
  },
  content: {
    padding: 20,
    gap: 16,
    // Add additional padding for Android
    ...Platform.select({
      android: {
        paddingTop: 50,
      },
    }),
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 30,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    gap: 16,
    backgroundColor: "transparent",
  },
});

export default SignInScreen;
