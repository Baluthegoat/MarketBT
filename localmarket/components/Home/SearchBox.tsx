import React from "react"
import { View, TextInput, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface SearchBoxProps {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function SearchBox({ value, onChangeText, placeholder = "Search" }: SearchBoxProps) {
  return (
    <View style={styles.searchBox}>
      <Ionicons name="search-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1e293b",
  },
})
