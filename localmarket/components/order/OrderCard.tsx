import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface OrderCardProps {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: any[]
  onPress?: () => void
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return '#f59e0b'
    case 'confirmed': return '#3b82f6'
    case 'delivered': return '#10b981'
    case 'cancelled': return '#ef4444'
    default: return '#6b7280'
  }
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending': return 'time-outline'
    case 'confirmed': return 'checkmark-circle-outline'
    case 'delivered': return 'checkmark-done-outline'
    case 'cancelled': return 'close-circle-outline'
    default: return 'help-circle-outline'
  }
}

export default function OrderCard({ id, total_amount, status, created_at, order_items, onPress }: OrderCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.idSection}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value} numberOfLines={1}>{id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
          <Ionicons name={getStatusIcon(status) as any} size={16} color={getStatusColor(status)} />
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.amount}>Nu {total_amount.toFixed(2)}</Text>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.dateText}>
            {new Date(created_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </Text>
        </View>

        {order_items.length > 0 && (
          <View style={styles.items}>
            <Text style={styles.itemsTitle}>{order_items.length} item{order_items.length > 1 ? 's' : ''}</Text>
            <Text style={styles.itemsPreview} numberOfLines={2}>
              {order_items.map(item => item.product_name).join(', ')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.viewText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#2563eb" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 12,
  },
  idSection: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateText: {
    marginLeft: 6,
    color: "#6b7280",
    fontSize: 14,
  },
  items: {
    marginTop: 8,
  },
  itemsTitle: {
    fontWeight: "600",
    fontSize: 12,
    color: "#374151",
  },
  itemsPreview: {
    fontSize: 14,
    color: "#6b7280",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  viewText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
    marginRight: 4,
  },
})
