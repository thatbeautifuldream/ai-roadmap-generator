"use server";
import axios from "axios";

export async function searchYoutube(searchQuery: string) {
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
  );
  if (!data) {
    console.log("The YouTube API failed");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("No video found");
    return null;
  }
  const videoIds = data.items.map((item: any) => item?.id?.videoId);
  return videoIds;
}
