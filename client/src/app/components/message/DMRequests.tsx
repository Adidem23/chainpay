"use client";

import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { IFeeds, PushAPI } from '@pushprotocol/restapi'

const DMRequests = ({ pushChatUser }: {
    pushChatUser: PushAPI
}) => {
    const [showRequest, setShowRequest] = React.useState<boolean>(false)
    const [requests, setRequests] = React.useState<IFeeds[]>([])


    useEffect(() => {
        const fetchRequests = async () => {
            const requests = await pushChatUser.chat?.list('REQUESTS');
            console.log(requests)
            console.log("requests")
            setRequests(requests)
            if (requests?.length > 0) {
                setShowRequest(true)
            }
        }
        fetchRequests();
    }, [pushChatUser.chat])

    return (
        <div>
            {showRequest &&
                (
                    <div>
                        <span className='text-lg font-semibold'>
                        Old Requests
                        </span>

                        <div className='flex flex-col items-center gap-2 justify-start p-3'>
                        {
                            requests?.map((request) => {
                                return (
                                    <div className='flex gap-2 flex-row items-center justify-evenly border-black border-2 rounded-[40px]' key={request.chatId}>
                                        <div className='w-1/3  text-sm flex flex-row items-center'>{ request.msg.messageObj?.content}</div>
                                        <div className='w-1/3 text-sm truncate'>{':'} {request.msg.fromDID?.split(':')[1]}</div>
                                        <Button
                                            className='w-16 h-3/5 text-sm' 
                                            onClick={() => {
                                            pushChatUser.chat?.accept(request.msg.fromDID?.split(':')[1])
                                            alert("Accepted")
                                            setShowRequest(false)
                                        }
                                        }>: Accept</Button>
                                        <Button className='w-16 h-3/5 text-sm' onClick={() => { pushChatUser.chat?.reject(request.msg.fromDID?.split(':')[1]) }}>: Reject</Button>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default DMRequests
