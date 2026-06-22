"use server"
import { cookies } from "next/headers"
import { useAuth } from "../auth-context";
import { UserNotificationState } from "../types";
  const { user, logout_user, loading } = useAuth();

// curl --location 'http://localhost:8002/notification/notifications/' \
// --header 'Authorization: Bearer eyJhbGc...'

export default async function fetchNotifications(): Promise<UserNotificationState | null> {
    try {
        // console.log("fetching permission menus", permissions)
        const cookieStore = await cookies()
        const response = await fetch(`${process.env.NEXT_PUBLIC_EKDAK_API_URL}/notification/notifications/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${cookieStore.get("access")?.value}`,
                'Accept': 'application/json'
            },
        })

        const user_notifications = await response.json()
        console.log("got user_notifications", user_notifications)
        if (response.status == 401) {
            // unauthorized or token expired
            await logout_user()
            return null
        }
        // // console.log("Response ------------->", res)
        if (!response.ok) {
            return null
        }

        return user_notifications
    } catch (err) {
        // console.log("fetch post error", err)
        return null
    }

}
