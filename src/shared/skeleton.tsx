import React, { useEffect, useState } from 'react';
import './skeleton.less';

export function Skeleton() {
  const [nums, setNums] = useState<number[]>([]);

  useEffect(() => {
    const length = Math.max(3, Math.random() * 10);
    const list = Array.from({ length }, () => Math.max(40, Math.random() * 100));
    setNums(list);
  }, []);

  return (
    <div className="onetoc-skeleton">
      {nums.map((s, i) => {
        return <p key={i} className="onetoc-skeleton-item" style={{ width: `${s}%` }} />;
      })}
    </div>
  );
}
