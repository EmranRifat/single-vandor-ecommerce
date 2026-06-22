"use client"

import { Button } from "@heroui/react";





const LoginButton = ({ btn_name }: { btn_name: string }) => {



    return (
        <Button>
            <p>{btn_name}</p>

        </Button>
    );
};

export default LoginButton;
