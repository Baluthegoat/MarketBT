import { Alert } from "react-native"
import { useState } from "react"
import { supabase } from "../lib/supabase"

export const useOrderService = ({ cartItems, getTotalPrice, clearCart, refetch }: any) => {
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  const generateOrderId = () => `ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  const handleCheckout = async () => {
    setCheckoutLoading(true)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      Alert.alert("Authentication Required", "Please log in to place an order.")
      setCheckoutLoading(false)
      return
    }

    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add items before checkout.")
      setCheckoutLoading(false)
      return
    }

    const totalAmount = getTotalPrice()
    const orderId = generateOrderId()

    Alert.alert("Confirm Order", `Total: Nu ${totalAmount.toFixed(2)}\nProceed?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Confirm", onPress: () => processOrder(orderId, totalAmount, user.id) },
    ])
  }

  const processOrder = async (orderId: string, totalAmount: number, userId: string) => {
    try {
      const { error: orderError } = await supabase.from("orders").insert({
        id: orderId,
        user_id: userId,
        total_amount: totalAmount,
        status: "pending",
        order_items: cartItems.map(item => ({
          product_id: item.product_id,
          product_name: item.product?.name || "Unknown Product",
          quantity: item.quantity,
          price: item.product?.price || 0,
          subtotal: (item.product?.price || 0) * item.quantity,
        }))
      })

      if (orderError) throw new Error(orderError.message)

      const orderItems = cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
        subtotal: (item.product?.price || 0) * item.quantity,
      }))

      await supabase.from("order_items").insert(orderItems)
      await clearCart()
      refetch()

      Alert.alert("Order Placed 🎉", `Order ID: ${orderId}\nTotal: Nu ${totalAmount.toFixed(2)}`)
    } catch (error) {
      Alert.alert("Order Failed", error instanceof Error ? error.message : "Unknown error")
    } finally {
      setCheckoutLoading(false)
    }
  }

  return { handleCheckout, checkoutLoading }
}
