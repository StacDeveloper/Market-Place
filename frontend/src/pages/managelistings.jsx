import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { LoaderIcon, toast } from "react-hot-toast"

const ManageListings = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { userListings } = useSelector((state) => state.listing)

  const [loadingListing, SetloadingListing] = useState(false)
  const [isEditing, SetisEditing] = useState(false)
  const [formData, SetFormData] = useState({
    title: "",
    platform: "",
    username: "",
    followers_count: "",
    engagement_rate: "",
    monthly_views: "",
    niche: "",
    price: "",
    description: "",
    verfied: false,
    monetized: false,
    country: '',
    age_range: false,
    images: [],
  })

  const platforms = ['youtube', 'instagram', 'tiktok', 'facebook', 'twitter', 'linkedin', 'pinterest', 'snapchat', 'twitch', 'discord']

  const niche = ['lifestyle', 'fitness', 'food', 'travel', 'tech', 'gaming', 'fashion', 'beauty', 'business', 'education', 'entertainment', 'music', 'art', 'sports', 'health', 'finance', 'other']

  const ageRange = ['13-17 years', '18-24 years', '25-34 years', '35-44 years', '45-54 years', '55+ years', 'Mixed ages']

  const handleInputChange = (field, value) => {
    SetFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    if (files.length + formData.images.length > 5) return toast.error("You can add upto 5 images")
    SetFormData((prev) => ({ ...prev, images: [...prev.images], ...files }))
  }
  const removeImage = (indextoRemove) => {
    SetFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== indextoRemove) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
  }
  // Get listing data for edit if id is provided (edit mode)



  useEffect(() => {
    if (!id) return
    SetisEditing(true)
    SetloadingListing(true)
    const listing = userListings.find((listing) => listing.id === id)
    if (listing) {
      SetFormData(listing)
      SetloadingListing(false)
    } else {
      toast.error("Listing not found")
      navigate("/mylistings")
    }
  }, [id])

  if (loadingListing) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <LoaderIcon className='size-7 animate-spin text-indigo-600' />
      </div>
    )
  }
  return (
    <div className='min-h-screen py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800'>
            {isEditing ? "Edit Listing" : "List Your Account"}
          </h1>
          <p className='text-gray-600 mt-2'>
            {isEditing ? "Update your existing account listing" : "Create a mock listing to display your account info"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          {/* BASIC FORM */}
          <Section title="Basic Information" >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <InputField label="Listing Title *" value={formData.title} placeholder="e.g., Premium Travel Instagram Account" onChange={(v) => handleInputChange('title', v)} required={true} />
            </div>
          </Section>
        </form>
      </div>
    </div>
  )
}

const Section = ({ title, children }) => {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6 space-y-6'>
      <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
      {children}
    </div>
  )
}

const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false, min = null, max = null }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input type={type} min={min} max={max} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 border-gray-300' required={required} />
    </div>
  )
}

const SelectField = ({ label, options, value, onChange, required = false }) => {
  return (
  <div>
    <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
  <select value={value} onChange={(e)=>onChange(e.target.value)} className='w-full px-3 py-1.5 text-gray-600 border rounded-md focus:outline-none focus:ring-indigo-500 border-gray-300'>

  </select>
  </div>

  )

}

export default ManageListings