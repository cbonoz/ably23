'use client';

import { APP_NAME, EXAMPLE_DATASETS } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";


export default function About() {

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="/logo.png" alt="AblyMonitor Logo" width={190} height={37} /><br /><br />
            </p>

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub&nbsp;
                <a href="https://github.com/cbonoz/ably23" target="_blank">here</a>.
            </p>

            <p>Run your own instance of {APP_NAME}:<br/>
            <a href="https://github.com/cbonoz/ably23#how-to-run" target="_blank">How to run</a>
            
            </p>

            <p>
                {/* Create listing */}
                <Button type="primary" onClick={() => {
                    router.push('/')
                }}>Go to dashboard</Button>&nbsp;


            </p>

            <Divider />


        </div>
    )
}