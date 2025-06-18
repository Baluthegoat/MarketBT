import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Product } from "../../lib/supabase"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  width: number
}

export function ProductCard({ product, onAddToCart, width }: ProductCardProps) {
  return (
    <View style={[styles.card, { width }]}>
      {product.image_url ? (
        <Image source={{ uri: product.image_url }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={40} color="#94a3b8" />
        </View>
      )}
      <Text style={styles.name}>{product.name}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {product.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => onAddToCart(product)}
        >
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#10b981",
  },
  cartButton: {
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 8,
  },
})
