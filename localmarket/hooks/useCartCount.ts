// hooks/useCartCount.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function useCartCount() {
  const [count, setCount] = useState(0)

  const fetchCartCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id)

      if (error) throw error

      const total = data?.reduce((sum, item) => sum + item.quantity, 0) || 0
      setCount(total)
    } catch (error) {
      console.error('Error fetching cart count:', error)
    }
  }

  useEffect(() => {
    fetchCartCount()

    const subscription = supabase
      .channel('cart_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cart_items' },
        fetchCartCount
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return count
}
