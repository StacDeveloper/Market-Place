import React, { useEffect, useState } from 'react'
import { dummyOrders, platformIcons } from "../assets/assets"
import { toast } from "react-hot-toast"
import { Loader2Icon } from 'lucide-react'

const MyOrders = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$"
  const [orders, Setorders] = useState([])
  const [loading, SetLoading] = useState(true)
  const [expanedId, SetExpandedID] = useState(null)

  const fetchOrders = async () => {
    Setorders(dummyOrders)
    SetLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const mask = (val, type) => {
    if (!val && val !== 0) return ""
    return type.toLowerCase() === "password" ? ".".repeat(8) : String(val)
  }

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to Clipboard")
    } catch (error) {
      console.log(error)
      toast.error("Copied Failed")
    }
  }

  if (loading) {
    return (
      <div className='h-[80vh] flex items-center justify-center'>
        <Loader2Icon className='size-7 animate-spin text-indigo-600' />
      </div>
    )
  }

  if (!orders.length) {
    return (
      <div className='px-4 md:px-16 lg:px-24 xl:px-32'>
        <div className='max-w-2xl mx-auto mt-14 bg-white rounded-xl border border-gray-200 p-8 text-center'>
          <h3 className='text-lg font-semibold'>No Orders Yet</h3>
          <p className='text-sm text-gray-500 mt-2'>
            You haven't purchased any listings yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='px-4 md:px-16 lg:px-24 xl:px-32 py-6'>
      <h2 className='text-2xl font-semibold mb-6'>
        My Orders
      </h2>
      <div className='space-y-4'>
        {orders.map((ord) => {
          const id = ord.id
          const listing = ord.listing
          const credential = ord.credential
          const isExpanded = expanedId === id
          return (
            <div key={id} className='bg-white rounded-lg border border-gray-200 p-5 flex flex-col max-w-4xl'>
              <div className='flex items-start gap-4 flex-1'>
                <div className='p-2 rounded-lg bg-gray-50 max-sm:hidden'>
                  {platformIcons[listing.platform]}
                </div>
                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>{listing.title}</h3>
                      <p className='text-sm text-gray-500 mt-1'>
                        @{listing.username} . <span className='capitalize'>{listing.platform}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders