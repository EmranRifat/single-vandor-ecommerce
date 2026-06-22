"use client";

import {
  Badge,
  Button,
  Card,
  CardHeader,
  Chip,
  CardBody,
  ScrollShadow,
  CardFooter,
  NavbarItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  NavbarContent,
  Navbar,
  Pagination,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import Cookies from "js-cookie";
import useNotification from "@/lib/hooks/useNotification";
import { useAllNotification } from "@/lib/hooks/useAllNotification";
import { useEffect, useRef, useState } from "react";
import { Notification } from "@/lib/store/sms_log/types";

const NotificationComponent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const token = Cookies.get("access") || "";
  const urlPattern = /(https?:\/\/[^\s]+)/;
  // Use the WebSocket hook with the persistent connection logic
  const { isConnected, messages } = useNotification(token);
  const { isLoading, data, error } = useAllNotification(
    token,
    "corporate-booking"
  );
  // console.log("messages", messages);
  // console.log("notification data", data);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (data?.notifications) {
      // setNotifications((prev) => [...prev, ...data.notifications]);
      // setIsFetching(false);
      setNotificationCount((prev) => prev + data.notifications.length);
      // console.log("notificationCount", notificationCount);
    }
  }, [data]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (
      container &&
      container.scrollTop + container.clientHeight >= container.scrollHeight &&
      !isLoading
    ) {
      setIsFetching(true);

      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        // console.log("currentPage old=", prevPage);
        // console.log("fetching more data");
        // console.log("currentPage new=", nextPage);
        return nextPage;
      });
    }
  };

  useEffect(() => {
    if (currentPage > 1) {
      // refetch();
    }
  }, [currentPage]);

  return (
    <Popover offset={12} placement="bottom-end">
      <PopoverTrigger>
        <Button
          disableRipple
          isIconOnly
          className="overflow-visible"
          radius="full"
          size="sm"
          variant="light"
        >
          <Badge
            color="default"
            content={messages.length + (data?.notifications?.length || 0)}
            showOutline={false}
            size="md"
          >
            <Icon
              className="text-[#ffffff]"
              icon="solar:bell-linear"
              width={22}
            />
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
        <Card className="w-full max-w-[420px]">
          <CardHeader className="flex flex-col px-0 pb-0">
            <div className="flex w-full items-center justify-between px-5 py-2">
              <div className="inline-flex items-center gap-1">
                <h4 className="inline-block align-middle text-large font-medium">
                  Notifications
                </h4>
                <Chip size="sm" variant="flat">
                  {messages.length + (data?.notifications?.length || 0)}
                </Chip>
              </div>
              <Button
                className="h-8 px-3"
                color="primary"
                radius="full"
                variant="light"
              >
                Mark all as read
              </Button>
            </div>
          </CardHeader>
          <CardBody className="w-full gap-0 p-0">
            <ScrollShadow className="h-[500px] w-full">
              {messages.length > 0
                ? messages.map((msg, index) => {
                  const match = msg.match(urlPattern);
                  const url = match ? match[0] : null;
                  return (
                    <div className="flex items-center gap-2 p-4">
                      <Icon
                        className="text-secondary"
                        icon="lucide:file-down"
                        width={30}
                      />
                      <div className="flex flex-col">
                        <strong className="text-small font-medium">
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              Download
                            </a>
                          ) : (
                            ""
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                })
                : ""}

              {data?.notifications.length || 0 > 0
                ? data?.notifications.map((dt, index) => {
                  return (
                    <div
                      className="flex gap-3 border-b border-divider px-6 py-4"
                      key={index}
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-small text-foreground">
                          <strong className="font-medium">{dt.title}</strong>
                        </p>
                        <time className="text-tiny text-default-400">
                          {dt.created_at.toString()}
                        </time>
                        {dt.files.length > 0
                          ? dt.files.map((file, index) => {
                            return (
                              <div
                                key={index}
                                className="flex items-center gap-2 p-4"
                              >
                                <Icon
                                  className="text-secondary"
                                  icon="lucide:file-down"
                                  width={30}
                                />
                                <div className="flex flex-col">
                                  <strong className="text-small font-medium">
                                    <a
                                      href={file.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      Download
                                    </a>
                                  </strong>
                                  <p className="text-tiny text-default-400">
                                    {file.file_size || "Unknown size"}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                          : ""}
                      </div>
                    </div>
                  );
                })
                : ""}
            </ScrollShadow>
          </CardBody>
          <CardFooter className="justify-end gap-2 px-4">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={data?.pagination.current_page || 1}
              total={data?.pagination.total || 0}
            />
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationComponent;
