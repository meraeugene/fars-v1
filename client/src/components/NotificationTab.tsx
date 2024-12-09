import { useSelector } from "react-redux";
import { RootState } from "../types";
import { useDispatch } from "react-redux";
import { clearNotifications } from "@/slices/notificationsSlice";

const NotificationTab = () => {
  const notifications = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch();

  // Create a new array and sort by createdAt in descending order
  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div className="absolute left-[0px] h-[500px] w-[350px] overflow-hidden overflow-y-auto rounded-md rounded-tl-none rounded-tr-none bg-white shadow-lg lg:top-[36px] xl:top-[40px]">
      <div className="flex items-center justify-between border-b p-4 pb-2">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          className="rounded-sm bg-red-500 px-2 py-1 text-xs text-red-50"
          onClick={() => dispatch(clearNotifications())}
        >
          🗑 Clear all
        </button>
      </div>
      {sortedNotifications.length ? (
        <div>
          <ul>
            {sortedNotifications.map((notification, index) => (
              <li
                key={index}
                className="flex w-full cursor-pointer flex-col border-b px-4 py-2 hover:bg-[#f0f4ff]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleDateString()}{" "}
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>

                  {index === 0 && (
                    <span className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white">
                      Newest
                    </span>
                  )}
                </div>
                <span className="mt-1 font-medium text-[#0c1b4d]">
                  {capitalizeFirstLetter(notification.name)}
                </span>
                <span className="mt-1 text-gray-700">
                  - {truncateText(notification.feedback, 30)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="p-4 text-gray-500">No new notifications</p>
      )}
    </div>
  );
};

export default NotificationTab;
