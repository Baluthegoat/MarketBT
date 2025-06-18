import { View, FlatList, RefreshControl, StyleSheet } from "react-native"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import OrderCard from "../components/order/OrderCard"
import EmptyState from "../components/order/EmptyState"
import LoadingIndicator from "../components/order/LoadingIndicator"

export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState([])
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
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  if (loading) return <LoadingIndicator message="Loading orders..." />

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, orders.length === 0 && styles.empty]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchOrders} colors={["#2563eb"]} />}
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  list: { padding: 16 },
  empty: { flex: 1 },
})
