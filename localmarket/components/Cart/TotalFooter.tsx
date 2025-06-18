import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"

interface TotalFooterProps {
  total: number
  onCheckout: () => void
  loading?: boolean
}

export default function TotalFooter({ total, onCheckout, loading = false }: TotalFooterProps) {
  return (
    <View style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total:</Text>
        <Text style={styles.totalAmount}>Nu {total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.checkoutButton, loading && styles.checkoutButtonDisabled]} 
        onPress={onCheckout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
  },
  checkoutButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  checkoutButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  checkoutButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
})