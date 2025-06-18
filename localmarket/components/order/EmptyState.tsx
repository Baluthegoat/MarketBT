import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function EmptyState() {
  return (
    <View style={styles.container}>
      <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
      <Text style={styles.title}>No Orders Yet</Text>
      <Text style={styles.subtitle}>When you place your first order, it will appear here.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
})
