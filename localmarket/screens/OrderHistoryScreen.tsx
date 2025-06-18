import { View, FlatList, Text, StyleSheet, RefreshControl, TouchableOpacity } from "react-native"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { Ionicons } from "@expo/vector-icons"

interface Order {
  id: string
  total_amount: number
  status: string
  created_at: string
  order_items: any[]
}

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Fetch orders error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f59e0b'
      case 'confirmed':
        return '#3b82f6'
      case 'delivered':
        return '#10b981'
      case 'cancelled':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'time-outline'
      case 'confirmed':
        return 'checkmark-circle-outline'
      case 'delivered':
        return 'checkmark-done-outline'
      case 'cancelled':
        return 'close-circle-outline'
      default:
        return 'help-circle-outline'
    }
  }

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.7}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId} numberOfLines={1}>
            {item.id}
          </Text>
        </View>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons 
            name={getStatusIcon(item.status) as keyof typeof Ionicons.glyphMap} 
            size={16} 
            color={getStatusColor(item.status)} 
          />
          <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.orderAmount}>Nu {item.total_amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#6b7280" />
          <Text style={styles.orderDate}>
            {new Date(item.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>

        {item.order_items && item.order_items.length > 0 && (
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsLabel}>
              {item.order_items.length} item{item.order_items.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.itemsPreview} numberOfLines={2}>
              {item.order_items.map((orderItem: any) => orderItem.product_name).join(', ')}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.orderFooter}>
        <TouchableOpacity style={styles.viewDetailsButton}>
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Ionicons name="chevron-forward" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color="#d1d5db" />
      <Text style={styles.emptyTitle}>No Orders Yet</Text>
      <Text style={styles.emptySubtitle}>
        When you place your first order, it will appear here.
      </Text>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading orders...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.ordersList,
          orders.length === 0 && styles.emptyList
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
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
  ordersList: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    paddingBottom: 12,
  },
  orderIdContainer: {
    flex: 1,
    marginRight: 12,
  },
  orderIdLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  orderDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  amountContainer: {
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
    marginLeft: 6,
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  itemsPreview: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563eb",
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 24,
  },
})