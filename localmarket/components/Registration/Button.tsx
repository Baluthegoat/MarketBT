// components/Button.tsx
import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface ButtonProps {
  onPress: () => void
  title: string
  loading?: boolean
  disabled?: boolean
}

export function Button({ onPress, title, loading, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={[styles.button, (loading || disabled) && styles.buttonDisabled]}
    >
      <Text style={styles.buttonText}>
        {loading ? "Please wait..." : title}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
})
