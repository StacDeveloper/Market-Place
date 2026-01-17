import React, { useState } from 'react'
import { ArrowLeftIcon, FilterIcon } from "lucide-react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import ListingCard from '../components/ListingCard'
import FilteredSidebar from '../components/FilteredSidebar'

const MarketPlace = () => {

  const [searchParams] = useSearchParams()
  const search = searchParams.get("search")
  const navigate = useNavigate()
  const [showFilterPhone, SetshowFilterPhone] = useState(false)
  const [filters, SetFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verfied: false,
    monitized: false
  })
  const { listings } = useSelector(state => state.listing)
  const filteredListings = listings.filter((list) => {
    if (filters.maxPrice) {
      if (list.price > filters.maxPrice) return false
    }
    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(list.platform)) return false
    }
    if (filters.minFollowers) {
      if (list.followers_count < filters.minFollowers) return false
    }
    if (filters.niche && filters.niche.length > 0) {
      if (!filters.niche.includes(list.niche)) return false
    }
    if (filters.verfied && list.verfied !== filters.verfied) return false
    if (filters.monitized && list.monitized !== filters.monitized) return false

    if (search) {
      const trimed = search.trim()
      if (
        !list.title.toLowerCase().includes(trimed.toLowerCase())
        && !list.description.toLowerCase().includes(trimed.toLowerCase())
        && !list.username.toLowerCase().includes(trimed.toLowerCase())
        && !list.platform.toLowerCase().includes(trimed.toLowerCase())
        && !list.niche.toLowerCase().includes(trimed.toLowerCase())
      ) {
        return false
      }
    }

    return true
  })


  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>
      <div className='flex items-center justify-between text-slate-500'>
        <button onClick={() => { navigate('/'); scrollTo(0, 0) }} className='flex items-center justify-between text-slate-500'>
          <ArrowLeftIcon />
          Back to Home
        </button>
        <button onClick={() => SetshowFilterPhone(true)} className='flex sm:hidden items-center gap-2 py-2'>
          <FilterIcon size={4} />
          Filters</button>
      </div>
      <div className='relative flex items-start justify-between gap-8 pb-8'>
        <div>
          {/* Filter */}
          <FilteredSidebar SetshowFilterPhone={SetshowFilterPhone} showFilterPhone={showFilterPhone} filters={filters} SetFilters={SetFilters} />
        </div>
        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {filteredListings.sort((a, b) => a.featured ? -1 : b.featured ? 1 : 0).map((list, index) => (
            <ListingCard ListingData={list} key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketPlace