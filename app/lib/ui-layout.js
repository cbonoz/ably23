'use client';

import { usePathname } from "next/navigation"
import Link from "next/link";
import StyledComponentsRegistry from "./registry";
import { GithubOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Image from "next/image";
import { APP_NAME, GITHUB_REPO, PRIMARY_COLOR } from "../constants";

function UiLayoutWrapper({ children }) {

    const pathname = usePathname()
    const menuItems = []
    menuItems.push({
        key: '/',
        label: <Link href="/">Dashboard</Link>,
        href: '/',
    })

    menuItems.push({
        key: '/about',
        label: <Link href="/about">About</Link>,
        href: '/about',
    })

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        colorPrimary: PRIMARY_COLOR,
                        algorithm: true, // Enable algorithm
                    },
                    Input: {
                        colorPrimary: PRIMARY_COLOR,
                        algorithm: true, // Enable algorithm
                    }
                },
            }}
        >
            <StyledComponentsRegistry>
                <Layout>
                    <Header style={{ background: '#fff', display: 'flex' }}>
                        <Image src="/logo.png" alt={APP_NAME}
                            className='header-logo'
                            height={32}
                            onClick={() => {
                                window.location.href = '/'
                            }}
                            width={175}
                        />

                        <Menu style={{ minWidth: '800px' }}
                            mode="horizontal" defaultSelectedKeys={pathname} items={menuItems} />

                        <span style={{ float: 'right', right: 20, position: 'absolute' }}>
                            {/* github icon */}
                            <GithubOutlined className='pointer'
                                onClick={() => {
                                    // Open tab
                                    window.open(GITHUB_REPO, '_blank')
                                }}
                            />
                        </span>


                    </Header>
                    <Content>
                        {/* Pass children to the content area */}
                        <div className='container'>
                            {children}
                        </div>
                    </Content>

                    <Footer style={{ textAlign: 'center' }}>
                        <hr />
                        <br />
                        {APP_NAME} ©2023. Created for the&nbsp;
                        <a href="https://ably.devpost.com/" target='_blank'>Ably Realtime Experiences Hackathon</a>.

                    </Footer>
                </Layout>

            </StyledComponentsRegistry>
        </ConfigProvider>
    )
}

export default UiLayoutWrapper