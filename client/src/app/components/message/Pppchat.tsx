"use client";

import React from 'react'
import { useEffect } from 'react';
import { Input } from './ui/input';
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import ChatContent from './ChatConten';
import { PushStream } from '@pushprotocol/restapi/src/lib/pushstream/PushStream';
import { typeCastToMessage } from '../../utils/Chat';

const Pppchat = ({ receiver, user }: {
    receiver: string,
    user: PushAPI
}) => {
    const [message, setMessage] = React.useState<string>("")
    const [chats, setChats] = React.useState<Message[]>([])
    const [liveChats, setLiveChats] = React.useState<Message[]>([])
    const [liveRequests, setLiveRequests] = React.useState<Message[]>([])
    const [userStream, setUserStream] = React.useState<PushStream>()

    useEffect(() => {
        const initStream = async () => {
            const stream = await user.initStream([CONSTANTS.STREAM.CHAT]);
            console.log(stream)
            setUserStream(stream)
            stream.connect();
        }
        initStream();
    }, [user])

    useEffect(() => {
        userStream?.on(CONSTANTS.STREAM.CHAT, (message) => {
            console.log(message);
            if (message.event === 'chat.message')
                setLiveChats((prev) => [...prev, message])
            else if (message.event === 'chat.request')
                setLiveRequests((prev) => [...prev, message])
        })
    }, [userStream])

    const handleSendMessage = async () => {
        const senderMessage = await user.chat.send(receiver, {
            content: message,
            type: 'Text'
        })
        console.log('message sent')
        console.log(senderMessage)
    }

    // useEffect(() => {
    //     const fetchRequests = async () => {
    //         const requests = await pushChatUser.chat?.list('REQUESTS');
    //         console.log(requests)
    //         console.log("requests")
    //         setRequests(requests)
    //         if (requests?.length > 0) {
    //             setShowRequest(true)
    //         }
    //     }
    //     fetchRequests();
    // }, [pushChatUser.chat])

    useEffect(() => {
        const fetchChats = async () => {
            const chats = await user?.chat?.history(receiver)
            console.log(chats)
            const typeCastedChats = chats?.map((chat) => {
                return typeCastToMessage({
                    content: chat,
                    type: 'ipfsFeed'
                })
            })
            setChats(typeCastedChats)
        }
        fetchChats()
    }, [user.chat, receiver])


    return (
        <div>

            {/* <Input onChange={(e) => setReceiver(e.target.value)} value={receiver} type='email' placeholder='Receiver Eth Address' /> */}
            <div className="grid w-full gap-2">
                <Textarea onChange={(e) => setMessage(e.target.value)} value={message} placeholder='Message' />
                <Button onClick={handleSendMessage}>Send message</Button>
            </div>

            {/* {showRequest &&
                (
                    <div>
                        Old Requests
                        {
                            requests?.map((request) => {
                                return (
                                    <div key={request.chatId}>
                                        {
                                            JSON.stringify(request.msg.messageObj)
                                        }
                                        {':'} {request.msg.fromDID?.split(':')[1]}
                                        <Button onClick={() => {
                                            pushChatUser.chat?.accept(request.msg.fromDID?.split(':')[1])
                                            alert("Accepted")
                                            setShowRequest(false)
                                        }
                                        }>: Accept</Button>
                                        <Button onClick={() => { pushChatUser.chat?.reject(request.msg.fromDID?.split(':')[1]) }}>: Reject</Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            } */}
            <hr />
            {/* Live Requests
            {
                liveRequests?.map((request) => {
                    return (
                        <div key={request.chatId}>
                            {
                                JSON.stringify(request.message)
                            }
                            <Button onClick={() => pushChatUser.chat?.accept(request.from.split(':')[1])}>{request.from?.split(':')[1]}: Accept</Button>
                            <Button onClick={() => pushChatUser.chat?.reject(request.from?.split(':')[1])}>{request.from?.split(':')[1]}: Reject</Button>
                        </div>
                    )
                })
            } */}
            <hr />
            {/* Old Chats */}
            {/* {
                chats?.map((chat) => {
                    return (
                        <div key={chat.chatId}>
                            {
                                JSON.stringify(chat.msg.messageObj)
                            }
                        </div>
                    )
                })
            } */}
            Chats
            {/* <ChatContent messages={chats} /> */}
            <hr />
            {/* Live Chats */}
            {/* {
                liveChats?.map((chat) => {
                    return (
                        <div key={chat.chatId}>
                            {
                                chat.origin === 'self' ? 'By Me' : 'By Other'
                            }
                            {
                                JSON.stringify(chat.message)
                            }
                        </div>
                    )
                })
            } */}
            <ChatContent messages={[...chats, ...liveChats]} />
        </div>
    )
}

export default Pppchat
