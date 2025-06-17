// components/EmptyCart.tsx
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function EmptyCart() {
  return (
    <View style={styles.centerContainer}>
      <Ionicons name="cart-outline" size={64} color="#94a3b8" />
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <Text style={styles.emptySubtext}>Add some products to get started</Text>
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
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    color: "#1e293b",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
  },
})
