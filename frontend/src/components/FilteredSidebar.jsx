import { ChevronDown, Filter, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilteredSidebar = ({ showFilterPhone, SetshowFilterPhone, filters, SetFilters }) => {

  const currency = import.meta.env.VITE_CURRENCY || "$"

  const [searchParams, SetsearchParams] = useSearchParams()
  const [search, SetSearch] = useState(searchParams.get("search") || "")
  const [expnadedSection, SetExpandedSection] = useState({
    platform: true,
    price: true,
    followers: true,
    niche: true,
    status: true
  })
  const navigate = useNavigate()
  const onSearchChange = (e) => {
    if (e.target.value) {
      SetsearchParams({ search: e.target.value })
      SetSearch(e.target.value)
    }
    else {
      navigate('/marketplace')
      SetSearch("")
    }
  }

  const toggleSection = (section) => {
    SetExpandedSection((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const platform = [
    { value: "youtube", label: "YouTube" },
    { value: "instagram", label: "Instagram" },
    { value: "tiktok", label: "TikTok" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "discord", label: "Discord" },
  ]

  const onFilterChange = (newFilter) => {
    SetFilters({ ...filters, ...newFilter })
  }

  const niches = [
    { value: "lifestyle", label: "Lifestyle" },
    { value: "fitness", label: "Fitness" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "tech", label: "Technology" },
    { value: "fashion", label: "Fashion" },
    { value: "beauty", label: "Beauty" },
    { value: "business", label: "Business" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "music", label: "Music" },
    { value: "art", label: "Art" },
    { value: "sports", label: "Sports" },
    { value: "health", label: "health" },
    { value: "finance", label: "Finance" },
  ]

  const onClearFilters = () => {
    if (search) {
      navigate("/marketplace")
    }
    SetFilters({
      platform: null,
      maxPrice: 100000,
      minFollowers: 0,
      niche: null,
      verified: false,
      monitized: false
    })
  }

  return (
    <div className={`${showFilterPhone ? "max-sm-fixed" : "max-sm:hidden"} max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px]`}>
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 text-gray-700'>
            <Filter size={4} />
            <h3 className='font-semibold'>Filters</h3>
          </div>
          <div className='flex items-center gap-2'>
            <X onClick={onClearFilters} className='size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colours cursor-pointer' />

            <button onClick={() => SetshowFilterPhone(false)} className='sm:hidden text-sm border text-gray-700 px-3 py-1 rounded'>Apply</button>
          </div>
        </div>
      </div>
      <div className='p-4 space-y-6 sm:max-h[calc(100vh-200px)] overflow-y-scroll no-scrollbar'>
        <div className='flex items-center justify-between'>
          <input onChange={onSearchChange} value={search} type="text" placeholder='Seach by username, platform, niche, etc.' className='w-full text-sm px-3 py-2 border border-gray-300 rounded-md outline-indigo-500' />
        </div>
        {/* Platform Filter */}
        <div>
          <button onClick={() => toggleSection("platform")} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Platform</label>
            <ChevronDown className={`size-4 ${expnadedSection.platform ? "rotate-180" : " "} transition-transform`} />
          </button>
          {expnadedSection.platform && (
            <div className='flex flex-col gap-2'>
              {platform.map((platform) => (
                <label key={platform.value} className='flex items-center gap-2 text-gray-700 text-sm'>
                  <input type="checkbox" checked={filters.platform?.includes(platform.value) || false} onChange={(e) => {
                    const checked = e.target.checked
                    const current = filters.platform || []
                    const updated = checked ? [...current, platform.value] : current.filter((p) => p !== platform.value); onFilterChange({ ...filters, platform: updated.length > 0 ? updated : null })
                  }} /><span>{platform.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        {/* Price Range */}
        <div>
          <button onClick={() => toggleSection("price")} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Price Range</label>
            <ChevronDown className={`size-4 ${expnadedSection.price ? "rotate-180" : " "} transition-transform`} />
          </button>
          {expnadedSection.price && (
            <div className='space-y-3'>
              <input type="range" min={"0"} max={"100000"} step={"100"} value={filters.maxPrice || 100000} onChange={(e) => onFilterChange({ ...filters, maxPrice: parseInt(e.target.value) })} className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600' />
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>{currency}0</span>
                <span>{currency}{(filters.maxPrice || 100000).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
        {/* Followers Range */}
        <div>
          <button onClick={() => toggleSection("followers")} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Minimum Followers</label>
            <ChevronDown className={`size-4 ${expnadedSection.followers ? "rotate-180" : " "} transition-transform`} />
          </button>
          {expnadedSection.followers && (
            <select
              value={filters.minFollowers?.toString() || "0"}
              onChange={(e) => onFilterChange({ ...filters, minFollowers: parseInt(e.target.value) || 0 })}
              name="" id="" className='w-full py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'>
              <option value="0">Any amount</option>
              <option value="1000">1k+</option>
              <option value="10000">10k+</option>
              <option value="50000">50k+</option>
              <option value="100000">100k+</option>
              <option value="500000">500k+</option>
              <option value="1000000">1M+</option>
            </select>
          )}
        </div>
        {/* Niche Filter */}
        <div>
          <button onClick={() => toggleSection("niche")} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Category</label>
            <ChevronDown className={`size-4 ${expnadedSection.niche ? "rotate-180" : " "} transition-transform`} />
          </button>
          {expnadedSection.niche && (
            <select
              value={filters.niche || ""}
              onChange={(e) => onFilterChange({ ...filters, niche: e.target.value || null })}
              name="" id="" className='w-full py-2 border border-gray-300 rounded-lg text-gray-700 outline-indigo-500'>
              <option value="">All Niches</option>
              {niches.map((niche) => (
                <option value={niche.value} key={niche.value}>{niche.label}</option>
              ))}
            </select>
          )}
        </div>
        {/* Verification Status */}
        <div>
          <button onClick={() => toggleSection("status")} className='flex items-center justify-between w-full mb-3'>
            <label className='text-sm font-medium text-gray-800'>Account Status</label>
            <ChevronDown className={`size-4 ${expnadedSection.status ? "rotate-180" : ""} transition-transform`} />
          </button>
          {expnadedSection.status && (
            <div className='space-y-3'>
              <label htmlFor="" className='flex items-center space-x-2 cursor-pointer'>
                <input type="checkbox" checked={filters.verfied || false} onChange={(e) => onFilterChange({ ...filters, verfied: e.target.checked })} />
                <span className='text-sm text-gray-700'>Verified Accounts Only</span>
              </label>
              <label htmlFor="" className='flex items-center space-x-2 cursor-pointer'>
                <input type="checkbox" checked={filters.monitized || false} onChange={(e) => onFilterChange({ ...filters, monitized: e.target.checked })} />
                <span className='text-sm text-gray-700'>Monitized Accounts Only</span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilteredSidebar