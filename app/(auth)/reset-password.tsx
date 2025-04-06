import * as React from "react";
import { ThemedText } from "@/components/ThemedText";
import { BodyScrollView } from "@/components/ui/BodyScrollView";
import { isClerkAPIResponseError, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { ClerkAPIError } from "@clerk/types";
import TextInput from "@/components/ui/tex-input";
import Button from "@/components/ui/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const ResetScreen = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [errors, setErrors] = React.useState<ClerkAPIError[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const onResetPasswordPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setErrors([]);
    setIsLoading(true);

    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });

      setPendingVerification(true);
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        // If it's not a structured Clerk error, create a generic one
        setErrors([
          {
            code: "unknown",
            message: "An error occurred during password reset",
            longMessage: typeof error === 'object' && error !== null && 'message' in error 
              ? String(error.message) 
              : "Please try again later",
          },
        ]);
      }
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, emailAddress, signIn]);

  const onVerifyPress = React.useCallback(async () => {
    if (!isLoaded) return;
    setErrors([]);
    setIsLoading(true);

    try {
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId,
        });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (error: any) {
      if (isClerkAPIResponseError(error)) {
        setErrors(error.errors);
      } else {
        // If it's not a structured Clerk error, create a generic one
        setErrors([
          {
            code: "unknown",
            message: "An error occurred during verification",
            longMessage: typeof error === 'object' && error !== null && 'message' in error 
              ? String(error.message) 
              : "Please try again later",
          },
        ]);
      }
      console.error(JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  }, [isLoaded, code, password, signIn, router, setActive]);

  if (pendingVerification) {
    return (
      <BodyScrollView contentContainerStyle={{ padding: 16 }}>
        <TextInput
          value={code}
          label={`Enter the verification code we sent to ${emailAddress}`}
          placeholder='Enter Verification code'
          onChangeText={setCode}
        />

        <TextInput
          value={password}
          label='Enter your new password'
          placeholder='Enter your new password'
          secureTextEntry
          onChangeText={setPassword}
        />

        {errors && errors.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            {errors.map((error) => (
              <ThemedText
                key={error.longMessage || error.message}
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: 8,
                  paddingHorizontal: 20,
                }}
              >
                {error.longMessage || error.message}
              </ThemedText>
            ))}
          </View>
        )}

        <Button 
          onPress={onVerifyPress} 
          disabled={!code || !password || isLoading}
          loading={isLoading}
        >
          Verify
        </Button>
      </BodyScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <BodyScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type='title' style={styles.header}>
          Reset Password
        </ThemedText>
        <TextInput
          autoCapitalize='none'
          value={emailAddress}
          label='Email'
          placeholder='Enter email'
          keyboardType='email-address'
          onChangeText={setEmailAddress}
        />

        <Button 
          onPress={onResetPasswordPress} 
          disabled={!emailAddress || isLoading}
          loading={isLoading}
        >
          Continue
        </Button>

        {errors && errors.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            {errors.map((error) => (
              <ThemedText
                key={error.longMessage || error.message}
                style={{
                  color: "red",
                  textAlign: "center",
                  marginTop: 8,
                  paddingHorizontal: 20,
                }}
              >
                {error.longMessage || error.message}
              </ThemedText>
            ))}
          </View>
        )}
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
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    // paddingTop: 30,
  },
  header: { alignSelf: "auto", paddingBottom: 20, paddingTop: 0 },
  content: {
    padding: 20,
    gap: 16,
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
export default ResetScreen;
