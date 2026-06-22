"use client"

import { Button } from "@heroui/react";





const LoginButtonMenu = ({ btn_name }: { btn_name: string }) => {



    return (
        <Button color="success" size="lg" className="w-full text-white text-md">
            <p>{btn_name}</p>

        </Button>
    );
};

export default LoginButtonMenu;
