// components/Button.tsx
import React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"

interface Props {
  onPress: () => void
  title: string
  disabled?: boolean
  loading?: boolean
}

export default function Button({ onPress, title, disabled = false, loading = false }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{title}</Text>}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
})
