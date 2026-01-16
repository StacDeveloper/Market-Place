import { BadgeCheck, LineChart, MapPin, User } from 'lucide-react'
import { platformIcons } from '../assets/assets'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ListingCard = ({ ListingData }) => {
    const currency = import.meta.env.VITE_CURRENCY || "$"
    const navigate = useNavigate()
    return (
        <div className='relative bg-white roudned-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition'>
            {ListingData.featured && (
                <>
                    <p className='py-1' />
                    <div className='absolute top-0 left-0 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center text-xs font-semibold py-1 tracking-wide uppercase'>Featured
                    </div>
                    <div className='p-5 pt-8'>
                        <div className='flex items-center gap-3 mb-3'>
                            {platformIcons[ListingData.platform]}
                            <div className='flex flex-col'>
                                <h2>{ListingData.title}</h2>
                                <p>@{ListingData.username} - <span className='capitalize'>{ListingData.platform}</span></p>
                            </div>
                            {ListingData.verified && (
                                <BadgeCheck className='text-green-500 ml-auto w-5 h-5' />
                            )}
                        </div>
                        {/* Stats */}
                        <div className='flex flex-wrap justify-between max-w-lg items-center gap-3 my-5'>
                            <div className='flex items-center text-sm text-gray-600'>
                                <User className='size-6 mr-1 text-gray-400' />
                                <span className='text-lg font-medium text-slate-800 mr-1.5'>{ListingData.followers_count.toLocaleString()}</span>Followers
                            </div>
                            {
                                ListingData.engagement_rate && (
                                    <div className='flex items-center text-sm text-gray-600'>
                                        <LineChart className='size-6 mr-1 text-gray-400' />
                                        <span className='text-lg font-medium text-slate-800 mr-1.5'>{ListingData.engagement_rate}</span> % engagement
                                    </div>
                                )
                            }
                            {/* Tags and Location */}
                            <div className='flex items-center gap-3 mb-3'>
                                <span className='text-sm font-medium bg-pink-100 text-pink-600 px-3 py-1 rounded-full capitalize'>{ListingData.niche}</span>
                                {ListingData.country && (
                                    <div className='flex items-center text-gray-500 text-sm'>
                                        <MapPin className='size-6 mr-1 text-gray-400' />
                                        {ListingData.country}
                                    </div>
                                )}
                            </div>
                            {/* Description */}
                            <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                                {ListingData.description} </p>
                        </div>

                        <hr className='my-5 border-gray-200' />

                        {/* Footer */}
                        <div className='flex items-center justify-between '>
                            <div className='flex items-baseline'>
                                <span className='text-2xl font-medium text-slate-800'>
                                    {currency}
                                    {ListingData.price.toLocaleString()}
                                </span>
                            </div>
                            <button onClick={() => { navigate(`/listings/${ListingData.id}`); scrollTo(0, 0) }} className='px-3 py-3 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition'>
                                <span>More Details</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default ListingCard