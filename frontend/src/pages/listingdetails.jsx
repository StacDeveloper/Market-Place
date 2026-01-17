
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProfileLink, platformIcons } from '../assets/assets'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowLeftIcon, ArrowUpRightFromSquareIcon, CheckCircle, ChevronLeftIcon, ChevronRightIcon, DollarSign, Loader2Icon, Users, LucideCandlestickChart, Eye, Calendar, MapPin, MessageCircle, ShoppingBagIcon, Copyright } from 'lucide-react'
import { setChat } from '../app/features/chatslice'

const ListingDetails = () => {

  const dispatch = useDispatch()

  const currency = import.meta.env.VITE_CURRENCY || "$"
  const [current, SetCurrent] = useState(0)
  const [listing, Setlisting] = useState(null)
  const navigate = useNavigate()
  const profileLink = listing && getProfileLink(listing.platform, listing.username)
  const { listingId } = useParams()
  const { listings } = useSelector((state) => state.listing)
  const images = listing?.images || ""

  const previousSlide = () => {
    SetCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    SetCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const loadChatbox = () => {
    dispatch(setChat({ listing: listing }))
  }

  const purchaseAccount = async () => {

  }

  useEffect(() => {
    const foundListing = listings.find((list) => list.id === listingId)
    if (foundListing) {
      Setlisting(foundListing)
    }
  }, [listingId, listings])

  return listing ? (
    <div className='mx-auto min-h-screen px-6 md:px-16 lg:px-24 xl:px-32'>
      <button onClick={() => navigate(-1)} className='flex items-center gap-2 text-slate-600 py-5'>
        <ArrowLeftIcon className='size-4' />
        Go to previous page
      </button>

      <div className='flex max-lg:flex-col gap-5'>
        {/* Left Content */}
        <div className='flex-1'>
          {/* Top Section with Seller Info */}
          <div className='bg-white rounded-xl border border-gray-200 p-6 mb-5'>
            <div className='flex max-md:flex-col gap-6'>
              {/* Listing Info */}
              <div className='flex-1'>
                <div className='flex items-start gap-3'>
                  <div className='p-2 rounded-xl'>{platformIcons[listing.platform]}</div>
                  <div className='flex-1'>
                    <h2 className='flex items-center gap-2 text-xl font-semibold text-gray-800'>
                      {listing.title}
                      <Link target='_blank' to={profileLink}>
                        <ArrowUpRightFromSquareIcon className='size-4 hover:text-indigo-500' />
                      </Link>
                    </h2>
                    <p className='text-gray-500 text-sm mt-1'>
                      @{listing.username} · {listing.platform?.charAt(0).toUpperCase() + listing.platform?.slice(1)}
                    </p>
                    <div className='flex gap-2 mt-2'>
                      {listing.verified && (
                        <span className='flex items-center text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md'>
                          <CheckCircle className='w-3 h-3 mr-1' />
                          Verified
                        </span>
                      )}
                      {listing.monetized && (
                        <span className='flex items-center text-xs bg-green-50 text-green-600 px-2 py-1 rounded-md'>
                          <DollarSign className='w-3 h-3 mr-1' />
                          Monetized
                        </span>
                      )}
                    </div>
                    <div className='mt-3'>
                      <h3 className='text-2xl font-bold text-gray-800'>{currency}{listing.price?.toLocaleString()}</h3>
                      <p className='text-sm text-gray-500'>USD</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Info Card - Right Side */}
              <div className='bg-gray-50 rounded-lg p-4 min-w-[280px]'>
                <h4 className='font-semibold text-gray-800 mb-3 text-sm'>Seller Information</h4>
                <div className='flex items-center gap-3 mb-3'>
                  <img src={listing.owner?.image} alt="seller" className='size-12 rounded-full object-cover' />
                  <div>
                    <p className='font-medium text-gray-800'>{listing.owner?.name}</p>
                    <p className='text-xs text-gray-500'>{listing.owner?.email}</p>
                  </div>
                </div>
                <p className='text-xs text-gray-600 mb-3'>
                  Member Since <span className='font-medium'>{new Date(listing.owner?.createdAt).toLocaleDateString()}</span>
                </p>
                <div className='flex flex-col gap-2'>
                  <button onClick={loadChatbox} className='w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium flex items-center justify-center gap-2'>
                    <MessageCircle className='size-4' /> Chat with Seller
                  </button>
                  {listing.isCredentialChanged && (
                    <button onClick={purchaseAccount} className='w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-medium flex items-center justify-center gap-2'>
                      <ShoppingBagIcon className='size-4' /> Purchase Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Screenshot Section */}
          {images?.length > 0 && (
            <div className='bg-white rounded-xl border border-gray-200 overflow-hidden mb-5'>
              <div className='p-4'>
                <h4 className='font-semibold text-gray-800'>Screenshots and Proof</h4>
              </div>
              <div className='relative w-full aspect-video overflow-hidden'>
                <div className='flex transition-transform duration-300 ease-in-out' style={{ transform: `translateX(-${current * 100}%)` }}>
                  {images.map((image, index) => (
                    <img src={image} key={index} alt='Listing Proof' className='w-full shrink-0 object-cover' />
                  ))}
                </div>
                <button
                  onClick={previousSlide}
                  className='absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition-colors'
                >
                  <ChevronLeftIcon className='w-5 h-5 text-gray-700' />
                </button>
                <button
                  onClick={nextSlide}
                  className='absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow transition-colors'
                >
                  <ChevronRightIcon className='w-5 h-5 text-gray-700' />
                </button>
                <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2'>
                  {images.map((_, i) => (
                    <button
                      onClick={() => SetCurrent(i)}
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${current === i ? "bg-indigo-600" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Metrics */}
          <div className='bg-white rounded-xl border border-gray-200 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Account Metrics</h4>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 p-4 text-center'>
              <div>
                <Users className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.followers_count?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Followers</p>
              </div>
              <div>
                <LucideCandlestickChart className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.engagement_rate}%
                </p>
                <p className='text-xs text-gray-500'>Engagement</p>
              </div>
              <div>
                <Eye className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {listing.monthly_views?.toLocaleString()}
                </p>
                <p className='text-xs text-gray-500'>Monthly Views</p>
              </div>
              <div>
                <Calendar className='mx-auto text-gray-400 w-5 h-5 mb-1' />
                <p className='font-semibold text-gray-800'>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </p>
                <p className='text-xs text-gray-500'>Listed</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className='bg-white rounded-xl border border-gray-200 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Description</h4>
            </div>
            <div className='p-4 text-sm text-gray-600 whitespace-pre-line'>
              {listing.description}
            </div>
          </div>

          {/* Additional Information */}
          <div className='bg-white rounded-xl border border-gray-200 mb-5'>
            <div className='p-4 border-b border-gray-100'>
              <h4 className='font-semibold text-gray-800'>Additional Information</h4>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 text-sm'>
              <div>
                <p className='text-gray-500 mb-1'>Niche</p>
                <p className='font-medium capitalize'>{listing.niche}</p>
              </div>
              <div>
                <p className='text-gray-500 mb-1'>Primary Country</p>
                <p className='flex items-center gap-1 font-medium'>
                  <MapPin className='size-4' /> {listing.country}
                </p>
              </div>
              <div>
                <p className='text-gray-500 mb-1'>Audience Age</p>
                <p className='font-medium'>{listing.age_range}</p>
              </div>
              <div>
                <p className='text-gray-500 mb-1'>Platform Verified</p>
                <p className='font-medium'>{listing.platformAssured ? "Yes" : "No"}</p>
              </div>
              <div>
                <p className='text-gray-500 mb-1'>Monetization</p>
                <p className='font-medium'>{listing.monetized ? "Enabled" : "Disabled"}</p>
              </div>
              <div>
                <p className='text-gray-500 mb-1'>Status</p>
                <p className='font-medium capitalize'>{listing.status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='bg-white border-t border-gray-200 p-6 text-center mt-10'>
        <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
          <Copyright className='size-4' /> 2025 <span className='text-indigo-600 font-medium'>Soham Mule</span>. All Rights Reserved.
        </p>
      </div>
    </div>
  ) : (
    <div className='h-screen flex justify-center items-center'>
      <Loader2Icon className='size-7 animate-spin text-indigo-600' />
    </div>
  )
}


