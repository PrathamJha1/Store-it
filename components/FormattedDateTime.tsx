import { cn, formatDateTime } from "@/lib/utils";
import React from "react";

const FormattedDateTime = ({
  date,
  classname,
}: {
  date: string;
  classname?: string;
}) => {
  return (
    <p className={cn("body-1 text-light-200", classname)}>
      {formatDateTime(date)}
    </p>
  );
};

export default FormattedDateTime;
