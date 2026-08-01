import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const resolveBlogMediaUrl = async (path: string | null): Promise<string | null> => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const { data } = await supabase.storage.from("blog-media").createSignedUrl(path, 60 * 60 * 24);
  return data?.signedUrl ?? null;
};

interface Props {
  path: string | null;
  type: string;
  className?: string;
  alt?: string;
}

const BlogMedia = ({ path, type, className, alt }: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    resolveBlogMediaUrl(path).then((u) => {
      if (active) setUrl(u);
    });
    return () => {
      active = false;
    };
  }, [path]);

  if (!path || type === "none" || !url) return null;

  if (type === "video") {
    return <video src={url} controls className={className} />;
  }
  return <img src={url} alt={alt ?? ""} className={className} loading="lazy" />;
};

export default BlogMedia;
