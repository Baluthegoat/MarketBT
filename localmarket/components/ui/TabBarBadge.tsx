// components/UI/TabBarBadge.tsx
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface TabBarBadgeProps {
  count: number
}

export default function TabBarBadge({ count }: TabBarBadgeProps) {
  if (count === 0) return null

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count.toString()}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
})
