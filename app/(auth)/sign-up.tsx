import * as React from "react";

import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/tex-input";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { StyleSheet, Platform, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";

const SignUpScreen = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);

  const [pendingVerification, setPendingVerification] = React.useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setErrors([]);

    try {
      //start auth
      await signUp.create({ emailAddress, password });

      // confirmation
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (error: any) {
      // Properly handle Clerk API errors with type safety
      if (
        error &&
        typeof error === "object" &&
        "errors" in error &&
        Array.isArray(error.errors)
      ) {
        setErrors(error.errors);
      } else {
        // If it's not a structured Clerk error, create a generic one
        setErrors([
          {
            code: "unknown",
            message: "An error occurred during sign up",
            longMessage:
              typeof error === "object" && error !== null && "message" in error
                ? String(error.message)
                : "Please try again later",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    setErrors([]);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.log(signUpAttempt);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <View style={{ flex: 1, height: "100%" }}>
        <BodyScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <View style={{ padding: 20, gap: 16, alignItems: "center" }}>
            <TextInput
              value={code}
              label={`Enter the verification code we sent to ${emailAddress}`}
              placeholder='Enter your verification code'
              onChangeText={(code) => setCode(code)}
              keyboardType='numeric'
            />

            <Button
              onPress={onVerifyPress}
              disabled={!code || isLoading}
              loading={isLoading}
              style={{ width: "100%", marginTop: 8 }}
            >
              Verify
            </Button>
          </View>

          {errors.map((error) => (
            <ThemedText
              key={error.longMessage}
              style={{
                color: "red",
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 20,
              }}
            >
              {error.longMessage}
            </ThemedText>
          ))}
        </BodyScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BodyScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <ThemedText type='title' style={[styles.header]}>
            Sign Up
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
            onPress={onSignUpPress}
            loading={isLoading}
            disabled={isLoading || !password || !emailAddress}
          >
            Sign up
          </Button>
          {errors.map((error, i) => (
            <ThemedText
              key={`${error.message}-${i}`}
              style={{ color: "red", paddingVertical: 8, fontWeight: 500 }}
            >
              Error {i + 1}: {error.message}
            </ThemedText>
          ))}
        </View>
      </BodyScrollView>

      <View style={styles.bottomButtonContainer}>
        <Button
          onPress={() => {
            router.back();
          }}
          variant='ghost'
          leftIcon={<MaterialIcons name='arrow-back' size={20} />}
        >
          Sign in
        </Button>
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
  },
  header: {
    alignSelf: "center",
    paddingTop: 25,
  },
  content: {
    padding: 20,
    gap: 4,
    // Add additional padding for Android
    ...Platform.select({
      android: {
        paddingTop: 0,
      },
    }),
  },
  bottomButtonContainer: {
    padding: 20,
    paddingBottom: 30,
    width: "40%",
    alignSelf: "center",
  },
});

export default SignUpScreen;
