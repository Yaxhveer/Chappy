import { format } from "timeago.js";

function classNames(...classes) {
  return classes?.filter(Boolean).join(" ");
}

export default function Message({ message, self }) {
  return (
    <>
      <li
        className={classNames(
          self !== message.sender ? "justify-start" : "justify-end",
          "flex"
        )}
      >
        <div>
          <div
            className={classNames(
              self !== message.sender
                ? "text-zinc-700 dark:text-zinc-400 bg-zinc-200 border border-zinc-400 shadow-md dark:bg-zinc-900 dark:border-zinc-700"
                : "bg-blue-600 dark:bg-blue-500 text-white",
              "relative max-w-[15rem] sm:max-w-[320px] md:max-w-[448px] lg:max-w-[576px] px-4 py-2 rounded-lg shadow"
            )}
          >
            <span className="block font-normal break-words">{message.message_data}</span>
          </div>
          <span className="block text-sm text-zinc-700 dark:text-zinc-400">
            {format(message.time_id)}
          </span>
        </div>
      </li>
    </>
  );
}
