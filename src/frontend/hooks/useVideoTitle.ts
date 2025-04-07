import { useMemo } from "react";

export function useVideoTitle(videoId: string, course: any): string | null {
  return useMemo(() => {
    if (!videoId || !course?.content) return null;

    for (const section of course.content) {
      const found = section.sectionContent?.find((video: any) => video.videoId === videoId);
      if (found) return found.title;
    }

    return null;
  }, [videoId, course]);
}