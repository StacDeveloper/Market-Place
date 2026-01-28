import React, { useEffect, useState } from 'react'
import { dummyOrders, platformIcons } from "../assets/assets"
import { toast } from "react-hot-toast"
import { CheckCircle2, ChevronDown, ChevronUp, Copy, Loader2Icon, ShieldEllipsis } from 'lucide-react'
import { format } from "date-fns"
import { useAuth, useUser } from '@clerk/clerk-react'
import api from '../configs/axios'

const MyOrders = () => {
  const { user, isLoaded } = useUser()
  const { getToken } = useAuth()
  const currency = import.meta.env.VITE_CURRENCY || "$"
  const [orders, Setorders] = useState([])
  const [loading, SetLoading] = useState(true)
  const [expanedId, SetExpandedID] = useState(null)

  const fetchOrders = async () => {
    try {
      SetLoading(true)
      const token = await getToken()
      const { data } = await api.get("/api/listing/user-orders", { headers: { Authorization: `Bearer ${token}` } })
      console.log(data)
      Setorders(data.ordersWithCredentials)
      SetLoading(false)
    } catch (error) {
      console.log(error)
      toast.error(error)
    }

  }

  useEffect(() => {
    if (user && isLoaded) {
      fetchOrders()
    }
  }, [isLoaded, user])

  const mask = (val, type) => {
    if (!val && val !== 0) return ""
    if (type.toLowerCase() === "password") {
      return (
        <span style={{ display: "inline-flex", gap: 4 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <ShieldEllipsis key={i} />
          ))}
        </span>
      )
    }
    return String(val)
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
  
  if (orders.length === 0) {
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
                      <div className='flex gap-2 mt-2'>
                        {listing.verified && (
                          <span className='flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md'>
                            <CheckCircle2 className='w-3 h-3 mr-1' />Verified
                          </span>
                        )}
                        {listing.monetized && (
                          <span className='flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md'>
                            <span className='text-xs font-medium mr-1'>$ </span>Monetized
                          </span>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-2xl font-bold'>
                        {currency}
                        {Number(ord.amount).toLocaleString()}
                      </p>
                      <p className='text-sm text-gray-500'>USD</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-2 items-end'>
                <button onClick={() => SetExpandedID((p) => (p === id ? null : id))} className='flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded hover:shadow text-sm' aria-expanded={isExpanded}>
                  {isExpanded ? (<>
                    <ChevronUp className='size-4' /> Hide Credentials
                  </>) : (
                    <>
                      <ChevronDown className='size-4' /> View Credentials
                    </>
                  )}
                </button>
                <div className='text-xs text-gray-500 mt-2 text-right'>
                  <div>
                    Credential Purchased: {format(new Date(ord.createdAt), "MMM, d, yyyy")}
                  </div>
                </div>
              </div>
              {isExpanded && (
                <div className='mt-4 md:mt-0 pt-4'>
                  <div className='space-y-2'>
                    {credential.updatedCredential.map((cred) => (
                      <div key={cred.name} className='flex items-center justify-between gap-3 bg-gray-50 text-gray-400 rounded-md p-2'>
                        <div>
                          <p className='text-sm font-bold text-gray-800'>{cred.name}</p>
                          <p>{cred.type}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <code className='text-sm text-black font-semibold'>
                            {mask(cred.value, cred.type)}
                          </code>
                          <button onClick={(e) => {
                            e.stopPropagation(); copy()
                          }} className='px-2 py-1 text-xs bg-white border border-gray-200 rounded hover:shadow' title='Copy Credential'>
                            <Copy className='size-4' />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders