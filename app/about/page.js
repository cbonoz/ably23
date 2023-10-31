'use client';

import { APP_NAME, EXAMPLE_DATASETS, GITHUB_REPO, HISTORY_LIMIT } from "../constants";
import Image from 'next/image'
import Button from 'antd/es/button'
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, Divider } from "antd";

const SECTIONS = [
    `${APP_NAME} is a self-hostable NextJS app that visualizes exceptions in a dashboard as they are thrown from your application in real time.`,
    "Apps like Sentry and Datadog exist for observability, but they often come with complex setups and a steep learning curve, and sometimes you may just be looking at a narrower problem of needing exception monitoring.",
    "The error message dashboard works by integrating into your application and capturing exceptions as they occur. It provides a real-time interface that displays these exceptions in a user-friendly manner, allowing developers to quickly identify and respond to issues.",
    `On refresh, ${APP_NAME} pulls up to the last ${HISTORY_LIMIT} messages from the Ably channel and displays them`,
]


export default function About() {

    const router = useRouter()
    return (
        <div className="about-page">
            <br />
            <br />

            <p>
                <Image src="/logo.png" alt="AblyMonitor Logo" width={220} height={37} />
            </p>
            <Divider />

            {SECTIONS.map((section, i) => {
                return <p key={i}>{section}</p>
            })}

            {/* github */}
            <p>
                {APP_NAME} is an open source project. You can find the code on GitHub&nbsp;
                <a href={GITHUB_REPO} target="_blank">here</a>.
            </p>

            <p>Run your own instance of {APP_NAME}:<br />
                <a href={`${GITHUB_REPO}#running-the-dashboard`} target="_blank">How to run</a>

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