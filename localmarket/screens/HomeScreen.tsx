import React, { useState, useEffect } from "react"
import { View, FlatList, StyleSheet, Dimensions, Alert } from "react-native"
import { supabase, type Product } from "../lib/supabase"
import { SearchBox } from "../components/Home/SearchBox"
import { ProductCard } from "../components/Home/ProductCard"
import { LoadingIndicator } from "../components/Home/LoadingIndicator"

const screenWidth = Dimensions.get("window").width
const itemWidth = (screenWidth - 48) / 2 // 2 columns with 16px padding on sides and 16px between

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const searchProducts = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      fetchProducts()
      return
    }

    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error searching products:", error)
    }
  }

  const addToCart = async (product: Product) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single()

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        })

        if (error) throw error
      }

      Alert.alert("✅ Added", "Product added to cart!")
    } catch (error) {
      console.error("Add to cart error:", error)
      Alert.alert("Error", "Could not add to cart.")
    }
  }

  return (
    <View style={styles.container}>
      <SearchBox
        value={searchQuery}
        onChangeText={searchProducts}
        placeholder="Search for products"
      />

      {loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard product={item} onAddToCart={addToCart} width={itemWidth} />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshing={loading}
          onRefresh={fetchProducts}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
})
