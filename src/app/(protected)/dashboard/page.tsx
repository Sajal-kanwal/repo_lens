'use client'
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import { ExternalLink, Github } from 'lucide-react'
import Link from 'next/link'
import React, { use } from 'react'

const DashboardPage = () => {
    const { project } = useProject()
    return (
        <div>
            <div className='flex items-center gap-y-4 justify-between flex-wrap'>
                {/* Github link and icon div */}
                <div className='w-fit rounded-md bg-primary px-4 py-3'>
                    <div className="flex items-center">
                        <Github className='size-5 text-white' />
                        <div className="ml-2">
                            <p className='text-sm font-medium text-amber-100'>
                                This project is linked to {}
                                <Link href={project?.repoUrl ?? ""} className='inline-flex items-center gap-1 text-amber/80 hover:underline'>
                                    {project?.repoUrl}
                                    <ExternalLink className='ml-1 size-4' />
                                </Link>
                            </p>
                        </div>
                    </div>
                    
                </div>
                <div className="h-4"></div>
                <div className="flex items-center gap-4">
                    Team Members
                    Invite Button
                    Archive Button
                </div>
            </div>
            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    AskQuestionCard
                    MeetingCard
                </div>
            </div>
            <div className="mt-8">
                Commit Log
            </div>
        </div>
    )
}

export default DashboardPage