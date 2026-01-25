import { useAuth } from '@clerk/clerk-react'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../configs/axios'
import { useDispatch } from 'react-redux'
import { getAllUserListing } from '../app/features/listingsslice'

const WithdrawModel = ({ onClose }) => {
    const { getToken } = useAuth()
    const dispatch = useDispatch()
    const [amount, setAmount] = useState("")
    const [account, setAccount] = useState([
        { type: "text", name: "Account Holder Name", value: "" },
        { type: "text", name: "Bank Name", value: "" },
        { type: "number", name: "Account Number", value: "" },
        { type: "text", name: "Account Type", value: "" },
        { type: "text", name: "SWIFT", value: "" },
        { type: "text", name: "Branch", value: "" },
    ])

    const handleSubmission = async (e) => {
        e.preventDefault()
        try {
            if (account.length === 0) {
                return toast.error("Please add atleast 1 field")
            }
            for (const field of account) {
                if (!field.value) {
                    return toast.error(`Please fill in the ${field.name} field `)
                }
            }
            const confirm = window.confirm("Are you sure you want to submit?")
            if (!confirm) return
            const token = await getToken()
            const { data } = await api.post("/api/listing/withdraw", { account, amount: parseInt(amount) }, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)
            dispatch(getAllUserListing(token))
            onClose()

        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-lg h-screen sm:h-auto flex flex-col'>
                {/* Header */}
                <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                    <div className='flex min-w-0'>
                        <h3 className='font-semibold text-lg truncate'>Withdrawal Request</h3>
                    </div>
                    <button onClick={onClose} className='ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors'>
                        <X className='w-5 h-6' />
                    </button>
                </div>

                {/* Form */}
                <form className='flex flex-col gap-4 p-4 overflow-y-auto' onSubmit={handleSubmission}>
                    {/* Amount Field */}
                    <div className='flex flex-col gap-2'>
                        <label className='text-sm font-medium text-gray-800'>
                            Amount
                        </label>
                        <input
                            type='number'
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400'
                            required
                        />
                    </div>

                    {/* Account Fields */}
                    {account.map((field, index) => (
                        <div key={index} className='flex flex-col gap-2'>
                            <label className='text-sm font-medium text-gray-800'>
                                {field.name}
                            </label>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) =>
                                    setAccount((prev) =>
                                        prev.map((c, i) => i === index ? { ...c, value: e.target.value } : c)
                                    )}
                                className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400'
                                required
                            />
                        </div>
                    ))}

                    {/* Button */}
                    <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mt-4 rounded-md w-full'>
                        Apply For Withdrawal
                    </button>
                </form>
            </div>
        </div>
    )
}

export default WithdrawModel