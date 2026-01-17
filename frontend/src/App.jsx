import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/homepage'
import MarketPlace from './pages/marketPlace'
import MyListings from './pages/mylistings'
import ListingDetails from './pages/listingdetails'
import ManageListings from './pages/managelistings'
import MessagesPage from './pages/messages'
import MyOrders from './pages/myorders'
import Loading from './pages/Loading'
import Navbar from './components/Navbar'


const App = () => {
  const { pathname } = useLocation()
  return (
    <div>
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

      </Routes>
    </div>
  )
}

export default App