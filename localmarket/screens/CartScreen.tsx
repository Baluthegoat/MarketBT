import { View, StyleSheet } from "react-native"
import { useEffect } from "react"
import { useCart } from "../hooks/useCart"
import { supabase } from "../lib/supabase"
import CartHeader from "../components/Cart/CartHeader"
import CartList from "../components/Cart/CartList"
import TotalFooter from "../components/Cart/TotalFooter"
import EmptyCart from "../components/Cart/EmptyCart"
import CartLoader from "../components/Cart/CartLoader"
import { useOrderService } from "../hooks/useOrderService"

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

  const { handleCheckout, checkoutLoading } = useOrderService({ cartItems, getTotalPrice, clearCart, refetch })

  useEffect(() => {
    const cartSub = supabase.channel("cart_changes_screen")
      .on("postgres_changes", { event: "*", schema: "public", table: "cart_items" }, () => setTimeout(refetch, 100))
      .subscribe()

    const orderSub = supabase.channel("order_changes_screen")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {})
      .subscribe()

    return () => {
      supabase.removeChannel(cartSub)
      supabase.removeChannel(orderSub)
    }
  }, [refetch])

<<<<<<< HEAD
=======
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

>>>>>>> d518b724cbb8d6c2c2cd6ea2d0c4e34aeb1d19f4
  const handleClearCart = () => {
    clearCart().then(() => refetch())
  }

  if (loading) return <CartLoader />
  if (cartItems.length === 0) return <EmptyCart />

  return (
    <View style={styles.container}>
      <CartHeader 
        itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} 
        onClear={handleClearCart} 
      />
      <CartList 
        items={cartItems} 
        onUpdate={updateQuantity} 
        onRemove={removeItem} 
        loading={loading} 
        onRefresh={refetch} 
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
})
