import { useState, useEffect } from "react"
import { Alert } from "react-native"
import { supabase, type CartItem } from "../lib/supabase"

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCartItems()
  }, [])

  const fetchCartItems = async () => {
    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setCartItems([])
        return
      }

      const { data, error } = await supabase
        .from("cart_items")
        .select(`*, product:products(*)`)
        .eq("user_id", user.id)

      if (error) throw error
      setCartItems(data || [])
    } catch (error) {
      console.error("Error fetching cart items:", error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return removeItem(itemId)

    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId)
      
      if (error) throw error
      
      // Update local state immediately for better UX
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } catch (error) {
      console.error("Error updating quantity:", error)
      Alert.alert("Error", "Failed to update quantity")
      // Refresh to get correct state
      fetchCartItems()
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", itemId)
      
      if (error) throw error
      
      // Update local state immediately
      setCartItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error("Error removing item:", error)
      Alert.alert("Error", "Failed to remove item")
      // Refresh to get correct state
      fetchCartItems()
    }
  }

  const clearCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id)

      if (error) throw error

      // Update local state immediately
      setCartItems([])
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error // Re-throw so the calling function can handle it
    }
  }

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        Alert.alert("Authentication Required", "Please log in to add items to cart")
        return
      }

      // Check if item already exists in cart
      const existingItem = cartItems.find(item => item.product_id === productId)
      
      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        // Add new item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity: quantity
          })
          .select(`*, product:products(*)`)
          .single()

        if (error) throw error

        // Update local state
        setCartItems(prev => [...prev, data])
        Alert.alert("Success", "Item added to cart!")
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      Alert.alert("Error", "Failed to add item to cart")
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0
      return total + price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    clearCart, // Added clearCart function
    addToCart, // Added addToCart function
    getTotalPrice,
    getTotalItems, // Added getTotalItems function
    refetch: fetchCartItems,
  }
}