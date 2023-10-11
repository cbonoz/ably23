'use client'

import { Button, Card, Image, Modal, Table } from "antd";
import { ABLY_CHANNEL, ABLY_KEY, ERROR_TABLE_COLUMNS } from "../constants";
import { useEffect, useRef, useState } from "react";
import * as Ably from 'ably';
import { AreaChart } from "react-chartkick";
import 'chartkick/chart.js'
import { isEmpty } from "../util";

const counts = {}

const ErrorDashboard = ({ }) => {
    const initialized = useRef(false)

    // const [client, setClient] = useState(null)
    const [messages, setMessages] = useState([])
    const [activeError, setActiveError] = useState()
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


const ERROR_TABLE_COLUMNS = [
    {
        title: 'Exception type',
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
            return <span>{type}</span>
        }
    },
    {
        title: 'Message',
        dataIndex: 'message',
        key: 'message',
        render: (message) => {
            return <span>{message}</span>
        }
    },
    {
        title: 'Trace',
        dataIndex: 'trace',
        key: 'trace',
        render: (trace, err) => {
            return <Button type="link" onClick={() => {
                setActiveError(err)
            }}>View trace</Button>
        }
    },
    {
        title: 'Time',
        dataIndex: 'timestamp',
        render: (timestamp) => {
            return <span>{new Date(timestamp).toLocaleString()}</span>
        }
    }
]

    useEffect(() => {
        // Prevent double initialization case in strict mode.
        if (initialized.current) {
            return;
        }
        initialized.current = true;
        
        // https://github.com/ably/ably-js#introduction
        const ablyClient = new Ably.Realtime(ABLY_KEY);

        const channel = ablyClient.channels.get(ABLY_CHANNEL)

        ablyClient.connection.once('connected', function () {
            console.log('connected')
            // https://ably.com/docs/storage-history/history?lang=javascript
            const options = {
                direction: 'backwards',
                limit: 1000, // could be variable depending on retention/rendering needs.
            }
            channel.history(options, (err, page) => {
                if (err) {
                    console.log('error getting history', err)
                    return
                }
                console.log('got history', page)
                const pastMessages = page.items.map(item => JSON.parse(item.data));
                pastMessages.forEach(message => {
                    updateGroupedMessages(message.timestamp)
                });
                setMessages(pastMessages)
            });


            channel.subscribe('exception', function (message) {
                const data = JSON.parse(message.data)
                console.log('received message', data)
                setMessages(messages => [...messages, data])
                updateGroupedMessages(data.timestamp)
            });
        });


        // setClient(ablyClient)
    }, [])

    // useEffect(() => {
    //     Object.keys(counts).forEach(key => {
    //         delete counts[key];
    //     })
    // }, [bucketType])

    const noMessages = isEmpty(messages)

    return <div>
        <div className="centered">
            <Image src="/logo.png" alt="AblyMonitor Logo" width={190} height={37} /><br />
            <h3>Dashboard</h3>
            <br/>
            <br/>
        </div>
        <Card title="Error Dashboard" style={{ width: '100%' }}>

            <AreaChart data={counts}
                xtitle="Time"
                ytitle="Errors"
            />

            {/* <Tabl */}

            {!noMessages && <Table
                dataSource={messages}
                columns={ERROR_TABLE_COLUMNS}
            />}

            {/* {messages.map((message, index) => {
                return <p key={index}>{message.data}</p>
            })} */}
        </Card>

        {/* Trace modal */}
        <Modal
            title={`Error: ${activeError?.type}`}
            open={activeError}
            size='large'
            onOk={() => {
                setActiveError(null)
            }}
            cancelButtonProps={{ style: { display: 'none' } }}
            onCancel={() => {
                setActiveError(null)
            }}>
                Trace
                <pre>{activeError?.trace}</pre>
            </Modal>


    </div>



}

export default ErrorDashboard


