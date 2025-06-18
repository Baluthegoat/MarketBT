// screens/RegisterScreen.tsx
import React, { useState } from "react"
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from "react-native"
import { FormInput } from "../components/Registration/FormInput"
import { Button } from "../components/Registration/Button"
import { LinkText } from "../components/Registration/LinkText"
import { useAuth } from "../hooks/useAuth"

export default function RegisterScreen({ navigation }: any) {
  const { register, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    try {
      await register(email, password)
      Alert.alert(
        "Success",
        "Account created successfully! Please check your email to verify your account."
      )
      navigation.navigate("Login")
    } catch (error: any) {
      Alert.alert("Registration Error", error.message)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the local market community</Text>

        <FormInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <FormInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button title="Sign Up" loading={loading} onPress={handleRegister} />

        <LinkText onPress={() => navigation.navigate("Login")}>
          Already have an account? Sign In
        </LinkText>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#1e293b",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    color: "#64748b",
  },
})
