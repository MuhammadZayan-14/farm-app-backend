export const handleNewMessageNotification = async (data) => {
    console.log("📩 New message notification:", data);

    // later you can:
    // - save to DB
    // - send push notification
    // - send email

    return {
        success: true,
        type: "NEW_MESSAGE",
        data,
    };
};

export const handleSeenNotification = async (data) => {
    console.log("👁 Message seen:", data);

    return {
        success: true,
        type: "MESSAGE_SEEN",
    };
};