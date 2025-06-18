import { FlatList, StyleSheet } from "react-native"
import CartItemCard from "./CartItemCard"

export default function CartList({ items, onUpdate, onRemove, loading, onRefresh }: any) {
  return (
    <FlatList
      data={items}
      renderItem={({ item }) => (
        <CartItemCard
          item={item}
          onIncrease={() => onUpdate(item.id, item.quantity + 1)}
          onDecrease={() => onUpdate(item.id, item.quantity - 1)}
          onRemove={() => onRemove(item.id)}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.cartList}
      showsVerticalScrollIndicator={false}
      refreshing={loading}
      onRefresh={onRefresh}
    />
  )
}

const styles = StyleSheet.create({
  cartList: {
    padding: 16,
  },
})
