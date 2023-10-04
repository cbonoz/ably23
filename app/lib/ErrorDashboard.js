'use client'

import { Card } from "antd";
import { ABLY_CHANNEL, ABLY_KEY } from "../constants";
import { useEffect, useState } from "react";
import * as Ably from 'ably';


const ErrorDashboard = ({ }) => {
    // const [client, setClient] = useState(null)
    const [messages, setMessages] = useState([])

    useEffect(() => {
        // https://github.com/ably/ably-js#introduction
        // already initialized
        // if (client) {
        //     return
        // }

        const ablyClient = new Ably.Realtime(ABLY_KEY);

        const channel = ablyClient.channels.get(ABLY_CHANNEL)

        ablyClient.connection.on('connected', function () {
            console.log('connected')
        });

        channel.subscribe('exception', function (message) {
            console.log('received message', JSON.stringify(message))
            setMessages(messages => [...messages, message])
        });
        // setClient(ablyClient)
    }, [])

    return <div>


        <Card title="Error Dashboard" style={{ width: 800 }}>


            {messages.map((message, index) => {
                return <p key={index}>{message.data}</p>
            })}
        </Card>


    </div>



}

export default ErrorDashboard


