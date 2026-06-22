"use client"

import { Button } from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";




const LogoutButtonMenu = ({ btn_name }: { btn_name: string }) => {
    const router = useRouter();
    const { setUser } = useAuth();

    const handleLogout = () => {
        Cookies.remove("token");
        Cookies.remove("user");
        Cookies.remove("role");
        Cookies.remove("access");
        Cookies.remove("refresh");
        setUser(null);
        router.push("/login");
    }

    return (
        <Button color="success" size="lg" className="w-full text-white text-md" onPress={handleLogout}>
            <p>{btn_name}</p>

        </Button>
    );
};

export default LogoutButtonMenu;
