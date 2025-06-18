import { View, Text, StyleSheet } from "react-native"

export default function CartLoader() {
  return (
    <View style={styles.centerContainer}>
      <Text style={styles.loadingText}>Loading cart...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
})
