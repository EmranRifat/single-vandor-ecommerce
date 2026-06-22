"use client"

import { Button } from "@heroui/react";





const SignupButtonMenu = ({ btn_name }: { btn_name: string }) => {



    return (
        <Button size="lg" className="w-full text-white text-md">
            <p>{btn_name}</p>

        </Button>
    );
};

export default SignupButtonMenu;
