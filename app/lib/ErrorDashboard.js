'use client'

import { Button, Card, Divider, Image, Modal, Select, Table, Tabs } from "antd";
import { ABLY_CHANNEL, ABLY_KEY } from "../constants";
import { useEffect, useRef, useState } from "react";
import * as Ably from 'ably';
import { AreaChart, BarChart, ColumnChart, PieChart } from "react-chartkick";
import { countMessagesByType, isEmpty } from "../util";

import 'chartkick/chart.js'

const ErrorDashboard = ({ }) => {
    const initialized = useRef(false)

    // const [client, setClient] = useState(null)
    const [messages, setMessages] = useState([])
    const [activeError, setActiveError] = useState()
    const [bucketType, setBucketType] = useState('minute')
    const [xmin, setXmin] = useState();
    const [xmax, setXmax] = useState();
    const [hours, setHours] = useState('1')
    const [counts, setCounts] = useState({})

    useEffect(() => {
        const now = new Date();
        const intHours = parseInt(hours)
        const minTime = new Date(now - intHours * 60 * 60 * 1000);
        setXmin(minTime);
        setXmax(now);
        // log
        console.log('xaxis', xmin, xmax)
    }, [hours])

    function groupMessages(items, bucketType) {
        const grouped = {}
        items.forEach(item => {
            const roundedDate = new Date(item.timestamp);
            roundedDate.setSeconds(0);
            roundedDate.setMilliseconds(0);
            const minutes = roundedDate.getMinutes();
            if (bucketType === 'minute') {
                roundedDate.setMinutes(Math.round(minutes));
            } else if (bucketType === '5 minutes') {
                roundedDate.setMinutes(Math.round(minutes / 5) * 5);
            } else if (bucketType === 'hour') {
                // Round to nearest hour or next day based on minutes
                const hour = roundedDate.getHours();
                roundedDate.setMinutes(0);
                roundedDate.setHours(hour + Math.round(minutes / 60));

            }
            const key = roundedDate;

            grouped[key] = (grouped[key] || 0) + 1;
        })
        return grouped;
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
                const newCounts = groupMessages(pastMessages, bucketType)
                setCounts(newCounts)
                setMessages(pastMessages)
            });


            channel.subscribe('exception', function (message) {
                const data = JSON.parse(message.data)
                console.log('received message', data)
                setMessages(messages => [...messages, data])
                const newCounts = groupMessages([data], bucketType)
                setCounts(counts => ({ ...counts, ...newCounts }))
            });
        });


        // setClient(ablyClient)
    }, [])

    useEffect(() => {
        // Update grouping with new type.
        const newCounts = groupMessages(messages, bucketType)
        setCounts(newCounts)
    }, [bucketType])

    const hasMessages = !isEmpty(messages)

    const tabs = [
        {
            label: 'Errors',
            key: 'errors',
            children: <div>
                <h3>Errors</h3>
                <p>View errors as they occur in real time.</p>
                <ColumnChart data={counts}
                    xtitle="Time"
                    ytitle="Errors"
                    
                    xmin={xmin}
                    xmax={xmax}
                />
            </div>
        },
        {
            label: 'Types',
            key: 'types',
            children: <div>
                <h3>Types</h3>
                <p>Breakdown of error types</p>
                <PieChart data={countMessagesByType(messages)} />
            </div>
        }
    ]

    return <div>
        <div className="centered">
            <Image src="/logo.png" alt="AblyMonitor Logo" width={190} height={37} /><br />
            <h3>Dashboard</h3>
            <br />
            <br />
        </div>
        <Card title="Error Dashboard" style={{ width: '100%' }}>

            <Tabs defaultActiveKey="errors" items={tabs} />

            {/* <Tabl */}

            {hasMessages &&
                <div>

                    {/* Grouping dropdown */}
                    <div>
                        <span>
                            {false && <span>
                                View last:&nbsp;
                                <Select
                                    style={{ width: 120 }}
                                    placeholder="Select time range"
                                    value={hours}
                                    onChange={(value) => {
                                        // log
                                        console.log('selected', value)
                                        setHours(value)
                                    }}>
                                    <Select.Option value='1'>1 hour</Select.Option>
                                    <Select.Option value='12'>12 hours</Select.Option>
                                    <Select.Option value='24'>24 hours</Select.Option>
                                </Select>&nbsp;
                            </span>}
                            Interval:&nbsp;<Select value={bucketType} style={{ width: 120 }} onChange={(value) => {
                                setBucketType(value)
                            }
                            }>
                                <Select.Option value="minute">Minute</Select.Option>
                                <Select.Option value="5 minutes">5 Minutes</Select.Option>
                                <Select.Option value="hour">Hour</Select.Option>
                                {/* <Select.Option value="day">Day</Select.Option> */}
                            </Select>
                        </span>
                    </div>

                    <Divider />
                    <h3 className="">Feed</h3>
                    <br />
                    <Table
                        dataSource={messages}
                        columns={ERROR_TABLE_COLUMNS}
                    />
                </div>
            }

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


