import axios from "@axios";
import { defineStore } from "pinia";

export const useNotificationListStore = defineStore("NotificationListStore", {
  actions: {
    // 👉 Fetch notifications data
    async fetchNotifications() {
      try {
        
        
        
        const response = await axios.get(`/owner/notifications`)

        return response
       
      } catch (error) {
        console.log(error);
      }
    },
    async updateIsReadForAll(read_at){
      try{
        const response = await axios.post('/owner/updateIsReadForAll',{
          read_at: read_at
        })
        return response
      }catch(error){
        console.log(error)
      }
    },
    async updateIsReadByNotificationId(notificationId){
      try{
        const response = await axios.post('/owner/updateIsReadByNotificationId',{
          notification_id: notificationId
        })
        return response

      }catch(error){
        console.log(error)
      }
    },
    

    // 👉 Add Owner
    addNotification(notificationData) {
      return new Promise((resolve, reject) => {
        axios
          .post("/apps/notifications/notification", {
            notification: notificationData,
          })
          .then((response) => resolve(response))
          .catch((error) => reject(error));
      });
    },
    async editNotification(notificationData){
      try {
        const response = await axios.post("/owner/updateNotificationById", {
            notification: notificationData
        });
        
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    // 👉 fetch single notification
    async fetchNotification(id) {
      try {

        const response = await axios.get("/owner/viewNotificationById", {params: {id: id} });
        
        
        return response;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteNotificationById(id){
      try{
        const response = await axios.post("/owner/deleteNotificationById",{id: id})
        console.log(response)
      }
      catch(error){
        console.log(error)
      }
    },

    // 👉 Delete Notification
    async closeNotification(id) {
      try{
        const response = await axios.post("/owner/closeNotificationById",{id: id})
        console.log(response)
      }
      catch(error){
        console.log(error)
      }
    },
  },
});
