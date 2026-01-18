import React from 'react'

const StatsCard = ({ title, value, icon, color }) => {
    const colormap = { indigo: 'bg-indigo-100', green: 'bg-green-100', yellow: 'bg-yellow-100' }
    return (
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-start justify-between'>
                <div>
                    <p className='text-sm font-medium text-gray-600'>{title}</p>
                    <p className='text-2xl font-bold text-gray-800'>{value}</p>

                </div>
                <div className={`size-12 ${colormap[color]} rounded-full flex items-center justify-center`}>{icon}</div>
            </div>
        </div>
    )
}

export default StatsCard