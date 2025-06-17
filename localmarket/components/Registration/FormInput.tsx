// components/FormInput.tsx
import React from "react"
import { TextInput, StyleSheet, TextInputProps } from "react-native"

export function FormInput(props: TextInputProps) {
  return <TextInput style={styles.input} {...props} />
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
  },
})
