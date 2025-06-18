// screens/LoginScreen.tsx
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

export default function LoginScreen({ navigation }: any) {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }
    try {
      await login(email, password)
      navigation.reset({ index: 0, routes: [{ name: "Home" }] })
    } catch (error: any) {
      Alert.alert("Login Error", error.message)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Local Market</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

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

        <Button title="Sign In" loading={loading} onPress={handleLogin} />

        <LinkText onPress={() => navigation.navigate("Register")}>
          Don't have an account? Sign Up
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
