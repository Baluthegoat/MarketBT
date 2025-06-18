// components/CartItemCard.tsx
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface Props {
  item: any
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItemCard({ item, onIncrease, onDecrease, onRemove }: Props) {
  return (
    <View style={styles.cartItem}>
      {item.product.image_url ? (
        <Image source={{ uri: item.product.image_url }} style={styles.productImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name="image-outline" size={30} color="#94a3b8" />
        </View>
      )}

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productPrice}>${item.product.price.toFixed(2)}</Text>

        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={onDecrease}>
            <Ionicons name="remove" size={20} color="#2563eb" />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
            <Ionicons name="add" size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  cartItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  placeholderImage: {
    width: 60,
    height: 60,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#1e293b",
  },
  productPrice: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  removeButton: {
    padding: 8,
  },
})
