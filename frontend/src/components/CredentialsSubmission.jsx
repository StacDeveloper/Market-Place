import { useAuth } from '@clerk/clerk-react'
import { CirclePlus, X } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux"
import api from '../configs/axios'
import { getAllPublicListing } from '../app/features/listingsslice'

const CredentialsSubmission = ({ onClose, listing }) => {
    const { getToken } = useAuth()
    const dispatch = useDispatch()
    const [newField, setNewField] = useState("")
    const [credential, setCredential] = useState([
        { type: "email", name: "Email", value: "" },
        { type: "password", name: "Password", value: "" },
    ])

    const handleAddField = () => {
        const name = newField.trim()
        if (!name) return toast("Please Enter a field name")
        setCredential((prev) => [...prev, { type: "text", name, value: "" }])
        setNewField("")
    }

    async function handleSubmission(e) {
        e.preventDefault()
        try {
            if (credential.length == 0) return toast.error("Please add atleast 1 field")
            for (const cred of credential) {
                if (!cred.value) {
                    return toast.error(`Please fill in the ${cred.name} field`)
                }
            }
            const confirm = window.confirm("Credential will be verified and changed post submission. Are you sure you want to submit?")

            const token = await getToken()
            const { data } = await api.post("/api/listing/add-credentials", { credential, listingId: listing.id }, { headers: { Authorization: `Bearer ${token}` } })
            toast.success(data.message)
            dispatch(getAllPublicListing(token))
            onClose()
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }



    return (
        <div className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-100 flex items-center justify-center sm:p-4'>
            <div className='bg-white sm:rounded-lg shadow-2xl w-full max-w-lg h-screen sm:h-auto flex flex-col'>
                <div className='bg-gradient-to-r from-indigo-600 to-indigo-400 text-white p-4 sm:rounded-t-lg flex items-center justify-between'>
                    <div className='flex-1 min-w-0'>
                        <h3 className='font-semibold text-lg'>{listing?.title}</h3>
                        <p className='text-sm text-white/90'>Adding Credentials for {listing?.username} on {listing?.platform}</p>
                    </div>
                    <button onClick={onClose} className='ml-4 p-1 hover:bg-white/20 rounded-lg transition-colors'>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form className='flex flex-col gap-4 p-4 overflow-y-auto' onSubmit={handleSubmission}>
                    {credential.map((cred, index) => (
                        <div key={index} className='grid grid-cols-[2fr_3fr_auto] items-center gap-2'>
                            <label className='text-sm font-medium text-gray-800'>{cred.name}</label>
                            <input
                                type={cred.type}
                                value={cred.value}
                                onChange={(e) => setCredential((prev) =>
                                    prev.map((c, i) => i === index ? { ...c, value: e.target.value } : c)
                                )}
                                className='w-full px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400'
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setCredential((prev) => prev.filter((_, i) => i !== index))}
                                className='p-1 hover:bg-gray-100 rounded'
                            >
                                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                            </button>
                        </div>
                    ))}

                    {/* Add More Fields */}
                    <div className='flex items-center gap-2 pt-2 border-t border-gray-200'>
                        <input
                            type="text"
                            value={newField}
                            onChange={(e) => setNewField(e.target.value)}
                            placeholder='Field Name...'
                            className='flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded outline-indigo-400'
                        />
                        <button
                            type='button'
                            onClick={handleAddField}
                            className='p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors'
                        >
                            <CirclePlus className='w-5 h-5' />
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button type='submit' className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 mt-4 rounded-md w-full'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CredentialsSubmission