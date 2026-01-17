import { ChevronDown, Filter, X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilteredSidebar = ({ showFilterPhone, SetshowFilterPhone, filters, SetFilters }) => {
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

  return (
    <div className={`${showFilterPhone ? "max-sm-fixed" : "max-sm:hidden"} max-sm:inset-0 z-100 max-sm:h-screen max-sm:overflow-scroll bg-white rounded-lg shadow-sm border border-gray-200 h-fit sticky top-24 md:min-w-[300px]`}>
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 text-gray-700'>
            <Filter size={4} />
            <h3 className='font-semibold'>Filters</h3>
          </div>
          <div className='flex items-center gap-2'>
            <X className='size-6 text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colours cursor-pointer' />

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
            <label>Platform</label>
            <ChevronDown className={`size-4 ${expnadedSection.platform ? "rotate-180" : " "} transition-transform`} />
          </button>
          {expnadedSection.platform && (
            <div className='flex flex-col gap-2'>
              {platform.map((platform) => (
                <label key={platform.value} className='flex items-center gap-2 text-gray-700 text-sm'>
                  <input type="checkbox" checked={filters.platform?.includes(platform.value) || false} /><span>{platform.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FilteredSidebar