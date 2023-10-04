'use client'

import { Card } from "antd";
import { ABLY_CHANNEL, ABLY_KEY } from "../constants";
import { useEffect, useState } from "react";
import * as Ably from 'ably';
import { AreaChart } from "react-chartkick";
import 'chartkick/chart.js'

const counts = {}

const ErrorDashboard = ({ }) => {
    // const [client, setClient] = useState(null)
    const [messages, setMessages] = useState([])
    const [bucketType, setBucketType] = useState('minute')

    function updateGroupedMessages(timestamp) {

        const date = new Date(timestamp);
        let key = '';

        if (bucketType === 'minute') {
            key = `${date.toISOString().slice(0, 17)}:00 -0800`
        } else if (bucketType === 'hour') {
            key = `${date.toISOString().slice(0, 14)}:00:00 -0800`;
        } else if (bucketType === 'day') {
            key = `${date.toISOString().slice(0, 11)}00:00:00 -0800`;
        }

        counts[key] = (counts[key] || 0) + 1;
        // log
        console.log(counts)
    }

    useEffect(() => {
        // https://github.com/ably/ably-js#introduction
        // already initialized
        // if (client) {
        //     return
        // }

        const ablyClient = new Ably.Realtime(ABLY_KEY);

        const channel = ablyClient.channels.get(ABLY_CHANNEL)

        ablyClient.connection.once('connected', function () {
            console.log('connected')
            channel.subscribe('exception', function (message) {
                console.log('received message', JSON.stringify(message))
                setMessages(messages => [...messages, message])
                updateGroupedMessages(message.timestamp)
            });
        });


        // setClient(ablyClient)
    }, [])

    useEffect(() => {
        Object.keys(counts).forEach(key => {
            delete counts[key];
        })
        messages.forEach(message => {
            updateGroupedMessages(message.timestamp)
        })
    }, [bucketType])

    return <div>


        <Card title="Error Dashboard" style={{ width: 800 }}>

            <AreaChart data={counts}
                xtitle="Time"
                ytitle="Errors"

            />


            {messages.map((message, index) => {
                return <p key={index}>{message.data}</p>
            })}
        </Card>


    </div>



}

export default ErrorDashboard


