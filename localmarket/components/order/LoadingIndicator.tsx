import { View, Text, StyleSheet } from "react-native"

export default function LoadingIndicator({ message = "Loading..." }) {
  return (
    <View style={styles.center}>
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: "#6b7280",
  },
})
