"use client"

import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

export default function NavbarRunningLogo({ brand_name, }: { brand_name: string }) {
    return (
        <>
            <div className='mb-3 w-full flex justify-center items-center'>
                <Player
                    autoplay
                    loop
                    speed={12}
                    src="/static/animations/postman-running.json"
                    style={{ height: '80px', width: '80px' }}
                    className="dark:hidden"
                />
                <Player
                    autoplay
                    loop
                    speed={12}
                    src="/static/animations/postman-running-dark.json"
                    style={{ height: '80px', width: '80px' }}
                    className="hidden dark:block"
                />
            </div>
            <p className="ml-2 w-full text-start ss:text-sm xxs:text-sm xs:text-xl sm:text-xl md:text-2xl lg:text-2xl text-white dark:text-black dark:text-white ">
                {brand_name}

            </p>
        </>
    )
}
