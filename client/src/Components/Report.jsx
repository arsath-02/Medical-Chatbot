"use client";

import { CalendarIcon, MessageSquare, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ReportCard({
  info = {
    userId: "N/A",
    message_count: 0,
    sentiment: "Unknown",
    sessionId: "N/A",
    summary: "No summary available",
    updatedAt: "",
  },
}) {
  // Format the date if it's a valid date string
  const formattedDate = info?.updatedAt
    ? formatDistanceToNow(new Date(info.updatedAt), { addSuffix: true })
    : "Unknown";

  // Determine sentiment badge color
  const getSentimentColor = (sentiment = "") => {
    const sentimentLower = sentiment?.toLowerCase() || "";
    if (sentimentLower.includes("positive"))
      return "bg-[#c6f6d5] text-[#22543d] dark:bg-[#22543d] dark:text-[#9ae6b4]";
    if (sentimentLower.includes("negative"))
      return "bg-[#feb2b2] text-[#9b2c2c] dark:bg-[#9b2c2c] dark:text-[#feb2b2]";
    if (sentimentLower.includes("neutral"))
      return "bg-[#bee3f8] text-[#2c5282] dark:bg-[#2c5282] dark:text-[#bee3f8]";
    return "bg-[#e2e8f0] text-[#2d3748] dark:bg-[#1a202c] dark:text-[#cbd5e0]";
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-border bg-card text-card-foreground shadow-sm hover:shadow transition-shadow text-black">
      <div className="flex flex-col space-y-1.5 p-6 pb-2 ">
        <h3 className="text-xl font-semibold leading-none tracking-tight flex items-center gap-2">
          <User className="h-5 w-5" />
          User Report
        </h3>
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-medium">{info?.userId || "N/A"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Session ID</p>
            <p className="font-medium truncate" title={info?.sessionId}>
              {info?.sessionId || "N/A"}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Sentiment</p>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(
                  info?.sentiment
                )}`}
              >
                {info?.sentiment || "Unknown"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Messages</p>
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="font-medium">{info?.message_count || 0}</span>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Summary</p>
          <p className="text-sm">{info?.summary || "No summary available"}</p>
        </div>

        <div className="pt-2 flex items-center text-xs text-muted-foreground">
          <CalendarIcon className="h-3 w-3 mr-1" />
          <span>Updated {formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
