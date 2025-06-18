// components/LinkText.tsx
import React from "react"
import { TouchableOpacity, Text, StyleSheet } from "react-native"

interface LinkTextProps {
  onPress: () => void
  children: React.ReactNode
}

export function LinkText({ onPress, children }: LinkTextProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.linkButton}>
      <Text style={styles.linkText}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  linkButton: {
    paddingVertical: 8,
  },
  linkText: {
    color: "#2563eb",
    textAlign: "center",
    fontSize: 14,
  },
})
