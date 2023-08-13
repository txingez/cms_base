import dayjs from "dayjs";

export const dateTimeFormatString = (dateTimeString) => {
    return dayjs(dateTimeString).format("YYYY-MM-DD HH:mm");
};
