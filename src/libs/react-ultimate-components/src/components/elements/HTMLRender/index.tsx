"use client";

import dompurify from "dompurify";

interface HTMLRenderProps {
  /**HTML a ser renderizado*/
  html: string;
  /**Classes extras do container externo*/
  containerClassName?: string;
}

export default function HTMLRender({
  html,
  containerClassName,
}: HTMLRenderProps) {
  const sanitizedHtml = dompurify.sanitize(html);
  return (
    <div
      className={containerClassName}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

