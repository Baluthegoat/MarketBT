import { View, Text, StyleSheet } from "react-native"

export default function CartHeader({ itemCount, onClear }: { itemCount: number, onClear: () => void }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
         ({itemCount} items)
      </Text>
      <Text style={styles.clearButton} onPress={onClear}>
        Clear All
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ef4444",
  },
})
