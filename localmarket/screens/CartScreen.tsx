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
