<script setup>
import echo from "../../plugins/echo";

import { useNotificationListStore } from "@/views/apps/notification/useNotificationListStore";
import { useOrderListStore } from "@/views/apps/order/useOrderListStore";
import { useRouter } from "vue-router";

const orderListStore = useOrderListStore();
const notificationListStore = useNotificationListStore();
const router = useRouter();

const notifications = ref([]);
notificationListStore
  .fetchNotifications()
  .then((items) => {
    items?.data?.map((notification) => {
      //console.log(JSON.parse(localStorage.getItem("userData")));
      if (notification.type == 0) {
        orderListStore
          .fetchItemsByOrderId(notification.data)
          .then((order) => {
            notifications.value.push({
              id: notification?.id,
              title: notification.title,
              subtitle: notification.body,
              time: `${formatDate(order.data?.created_at)}`,
              isSeen: notification.admin_read_at === null ? false : true,
              type: notification?.type,
              data: notification?.data,
              add_data: notification?.add_data,
            });
            //console.log(notifications.value);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  })
  .catch((error) => {
    console.log(error);
  });
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  });
};
const removeNotification = (notificationId) => {
  notificationListStore.deleteNotificationById(notificationId).then((res) => {
    notifications.value.forEach((item, index) => {
      if (notificationId === item.id) notifications.value.splice(index, 1);
    });
  });
};

const markRead = (notificationId) => {
  notifications.value.forEach((item) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.isSeen = true;
    });
  });
};

const markUnRead = (notificationId) => {
  notifications.value.forEach((item) => {
    notificationId.forEach((id) => {
      if (id === item.id) item.isSeen = false;
    });
  });
};

const handleNotificationClick = (notification) => {
  if (!notification.isSeen) {
    notificationListStore
      .updateIsReadByNotificationId(notification.id)
      .then((res) => {
        console.log(res);
        markRead([notification.id]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  if (notification.type == 0) {
    router.push({
      name: "apps-order-view-id",
      params: { id: notification.data },
    });
  }
};
echo.channel("notification-create").listen("NotificationCreated", (data) => {
  if (data.notification.type == 0) {
    orderListStore.fetchItemsByOrderId(data.notification.data).then((res) => {
      notifications.value.push({
        id: res.data?.id,
        title: res.data.title,
        subtitle: res.data.body,
        time: `${formatDate(res.data?.created_at)}`,
        isSeen: false,
        type: `${res.data?.type}`,
        data: res.data?.id,
        add_data: res.data?.add_data,
      });
    });
  } else if (data.notification.type == 2) {
  }
  // Handle the event data here
});
</script>

<template>
  <Notifications
    :notifications="notifications"
    @remove="removeNotification"
    @read="markRead"
    @unread="markUnRead"
    @click:notification="handleNotificationClick"
  />
</template>
