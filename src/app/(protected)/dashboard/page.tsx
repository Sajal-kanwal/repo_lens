'use client'
import { useUser } from '@clerk/nextjs'
import React, { use } from 'react'

const DashboardPage = () => {
    const user = useUser()
    return (
        <div>DashboardPage for {user.user?.firstName}</div>
    )
}

export default DashboardPage