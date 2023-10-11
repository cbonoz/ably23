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
                {APP_NAME} is an open source project. You can find the code on GitHub here:&nbsp;
                <a href="https://github.com/identity23" target="_blank">GitHub</a>&nbsp;
            </p>

            <p>Note this is a hackathon prototype and would require additional work to be mainnet ready. By uploading data you agree that this service is used as-is and that data may be compromised or shared outside the platform.</p>

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