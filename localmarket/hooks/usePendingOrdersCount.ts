// hooks/usePendingOrdersCount.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function usePendingOrdersCount() {
  const [count, setCount] = useState(0)

  const fetchOrdersCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['pending', 'confirmed'])

      if (error) throw error

      setCount(data?.length || 0)
    } catch (error) {
      console.error('Error fetching orders count:', error)
    }
  }

  useEffect(() => {
    fetchOrdersCount()

    const subscription = supabase
      .channel('order_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        fetchOrdersCount
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return count
}
