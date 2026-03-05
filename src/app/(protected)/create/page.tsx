'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import useRefetch from '@/hooks/use-refetch'
import { api } from '@/trpc/react'
import { tr } from 'date-fns/locale'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type FormInput = {
    repoUrl: string
    projectName: string
    githubToken?: string
}
const CreatePage = () => {
    const {register, handleSubmit, reset} = useForm<FormInput>()
    const createProject = api.project.createProject.useMutation()
    const refetch = useRefetch()
    function onSubmit(data: FormInput) {
        createProject.mutate({
            githubUrl: data.repoUrl,
            name: data.projectName,
            githubToken: data.githubToken
        },{
            onSuccess: () => {
                toast.success('Project created successfully!')
                refetch()
                reset()
            },
            onError: () => {
                toast.error('Failed to create project. Please try again.')
            }
        })
        reset()
        return true
    } 
    return (
        <div className='flex items-center gap-12 h-full justify-center'>
            <img src='/undraw_add-file.svg' className='h-56 w-auto' />
            <div>
                <div>
                    <h1 className='font-semibold text-2xl'>
                        Link your repository to get started
                    </h1>
                    <p className='text-muted-foreground text-sm'>Enter your repository details below to begin tracking changes.</p>
                </div>
                <div className="h-4">
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Input required {...register('projectName')} placeholder="Project Name" />
                            <div className="h-2"></div>
                            <Input required {...register('repoUrl')} placeholder="Repository URL" type='url' />
                            <div className="h-2"></div>
                            <Input {...register('githubToken')} placeholder="GitHub Token (Optional)" />
                            <div className="h-4"></div>
                            <Button type='submit' disabled={createProject.isPending}>
                                Create Project
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePage