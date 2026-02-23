import Image from "next/image";
import React from "react";

const Arrow = ({ direction = 0 }) => {
  return (
 <Image
        src="/arrow-right.svg"
        height={48}
        width={48}
        alt="arrow"
        style={{ transform: `rotate(${Number(direction)}deg)` }}
      />
  );
};

export default Arrow;
