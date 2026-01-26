import React, { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './pages/homepage'
import MarketPlace from './pages/marketPlace'
import MyListings from './pages/mylistings'
import ListingDetails from './pages/listingdetails'
import ManageListings from './pages/managelistings'
import MessagesPage from './pages/messages'
import MyOrders from './pages/myorders'
import Loading from './pages/Loading'
import Navbar from './components/Navbar'
import ChatBox from './components/ChatBox'
import { Toaster } from "react-hot-toast"
import Layout from './pages/admin-pages/Layout'
import Dashboard from './pages/admin-pages/Dashboard'
import AllListings from './pages/admin-pages/AllListings'
import CredentialChange from './pages/admin-pages/CredentialChange'
import CredentialVerify from './pages/admin-pages/CredentialVerify'
import Transactions from './pages/admin-pages/Transactions'
import Withdrawal from './pages/admin-pages/Withdrawal'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useDispatch } from 'react-redux'
import { getAllPublicListing, getAllUserListing } from './app/features/listingsslice'



const App = () => {
  const { pathname } = useLocation()
  const { getToken } = useAuth()
  const { user, isLoaded } = useUser()
  const navigate= useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch(getAllPublicListing(getToken))
  }, [])


  useEffect(() => {
    if (isLoaded && user) {
      dispatch(getAllUserListing(getToken))
    }
  }, [isLoaded, user])

  if(!isLoaded){
    return (
      <div>
        <Loading/>
      </div>
    )
  }

  return (
    <div>
      <Toaster />
      {!pathname.includes("/admin") && <Navbar />}
      <Routes>
        <Route path={"/"} element={<HomePage />} />
        <Route path={"/marketplace"} element={<MarketPlace />} />
        <Route path={"/mylistings"} element={<MyListings />} />
        <Route path={"/listings/:listingId"} element={<ListingDetails />} />
        <Route path={"/create-listing"} element={<ManageListings />} />
        <Route path={"/edit-listings/:id"} element={<ManageListings />} />
        <Route path={"/messages"} element={<MessagesPage />} />
        <Route path={"/my-orders"} element={<MyOrders />} />
        <Route path={"/loading"} element={<Loading />} />
        <Route path='/admin' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='verify-credentials' element={<CredentialVerify />} />
          <Route path='change-credentials' element={<CredentialChange />} />
          <Route path='list-listings' element={<AllListings />} />
          <Route path='transactions' element={<Transactions />} />
          <Route path='withdrawal' element={<Withdrawal />} />
        </Route>
      </Routes>
      <ChatBox />
    </div>
  )
}

export default App