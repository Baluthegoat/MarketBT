import React from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"

interface LoadingIndicatorProps {
  size?: "small" | "large"
  color?: string
}

export function LoadingIndicator({ size = "large", color = "#3b82f6" }: LoadingIndicatorProps) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size={size} color={color} />
    </View>
  )
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})
