// components/TextInputField.tsx
import React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"

interface Props {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  multiline?: boolean
  numberOfLines?: number
  keyboardType?: any
  autoCapitalize?: "none" | "sentences" | "words" | "characters"
  textAlignVertical?: "top" | "center" | "bottom"
}

export default function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines,
  keyboardType,
  autoCapitalize = "sentences",
  textAlignVertical,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: numberOfLines ? numberOfLines * 25 : 100, paddingTop: 12 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        textAlignVertical={textAlignVertical}
        placeholderTextColor="#94a3b8"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#f9fafb",
  },
})
