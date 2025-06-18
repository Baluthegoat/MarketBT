import React from "react"
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url?: string | null
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  width?: number | string
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
        <Text style={styles.price}>Nu. {product.price.toFixed(2)}</Text>
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#475569",
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "700",
    fontSize: 16,
    color: "#16a34a",
  },
  cartButton: {
    backgroundColor: "#16a34a",
    padding: 6,
    borderRadius: 6,
  },
})
