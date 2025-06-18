import { View, FlatList, StyleSheet, Text, Alert } from "react-native"
import { useState, useEffect } from "react"
import { useCart } from "../hooks/useCart"
import { supabase } from "../lib/supabase"
import CartItemCard from "../components/Cart/CartItemCard"
import EmptyCart from "../components/Cart/EmptyCart"
import TotalFooter from "../components/Cart/TotalFooter"

export default function CartScreen() {
  const {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    getTotalPrice,
    clearCart,
    refetch,
  } = useCart()
  
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    const cartSubscription = supabase
      .channel('cart_changes_screen')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items'
        },
        (payload) => {
          console.log('Cart changed:', payload)
          setTimeout(() => {
            refetch()
          }, 100)
        }
      )
      .subscribe()

    const orderSubscription = supabase
      .channel('order_changes_screen')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order changed:', payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(cartSubscription)
      supabase.removeChannel(orderSubscription)
    }
  }, [refetch])

  const generateOrderId = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `ORDER_${timestamp}_${random}`
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity)
      setTimeout(() => {
        refetch()
      }, 50)
    } catch (error) {
      console.error("Update quantity error:", error)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      setTimeout(() => {
        refetch()
      }, 50)
    } catch (error) {
      console.error("Remove item error:", error)
    }
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true)
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError || !user) {
        Alert.alert("Authentication Required", "Please log in togit version control in steps place an order.")
        return
      }

      if (cartItems.length === 0) {
        Alert.alert("Empty Cart", "Please add items to your cart before checkout.")
        return
      }

      const totalAmount = getTotalPrice()
      const orderId = generateOrderId()

      Alert.alert(
        "Confirm Order",
        `Total: Nu ${totalAmount.toFixed(2)}\n\nProceed with checkout?`,
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Confirm", 
            onPress: () => processOrder(orderId, totalAmount, user.id)
          }
        ]
      )

    } catch (error) {
      console.error("Checkout error:", error)
      Alert.alert("Error", "Something went wrong. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  const processOrder = async (orderId: string, totalAmount: number, userId: string) => {
    try {
      setCheckoutLoading(true)

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          id: orderId,
          user_id: userId,
          total_amount: totalAmount,
          status: "pending",
          order_items: cartItems.map(item => ({
            product_id: item.product_id,
            product_name: item.product?.name || "Unknown Product",
            quantity: item.quantity,
            price: item.product?.price || 0,
            subtotal: (item.product?.price || 0) * item.quantity
          }))
        })
        .select()
        .single()

      if (orderError) {
        throw new Error(`Order creation failed: ${orderError.message}`)
      }

      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
        subtotal: (item.product?.price || 0) * item.quantity
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) {
        console.error("Order items error:", itemsError)
      }

      await clearCart()
      setTimeout(() => {
        refetch()
      }, 100)

      Alert.alert(
        "Order Placed Successfully! 🎉",
        `Order ID: ${orderId}\nTotal: Nu ${totalAmount.toFixed(2)}`,
        [
          { text: "View Orders", onPress: () => console.log("Order placed:", orderId) },
          { text: "Continue Shopping", style: "cancel" }
        ]
      )

    } catch (error) {
      console.error("Process order error:", error)
      Alert.alert(
        "Order Failed", 
        `Failed to place order: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from your cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: async () => {
            try {
              await clearCart()
              setTimeout(() => {
                refetch()
              }, 50)
              Alert.alert("Success", "Cart cleared successfully!")
            } catch (error) {
              Alert.alert("Error", "Failed to clear cart")
            }
          }
        }
      ]
    )
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    )
  }

  if (cartItems.length === 0) {
    return <EmptyCart />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Shopping Cart ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
        </Text>
        <Text 
          style={styles.clearButton} 
          onPress={handleClearCart}
        >
          Clear All
        </Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrease={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            onDecrease={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            onRemove={() => handleRemoveItem(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cartList}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={refetch} // ✅ Pull-to-refresh functionality
      />

      <TotalFooter 
        total={getTotalPrice()} 
        onCheckout={handleCheckout}
        loading={checkoutLoading}
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
  cartList: {
    padding: 16,
  },
})
