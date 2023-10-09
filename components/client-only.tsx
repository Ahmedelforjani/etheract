"use client";

import React from "react";

export default function ClientOnly({ children }: React.PropsWithChildren) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <>{children}</>;
}
