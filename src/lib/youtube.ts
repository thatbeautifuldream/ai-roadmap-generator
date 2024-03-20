import axios from "axios";

export async function searchYoutube(searchQuery: string) {
    // hello world => hello+world
    searchQuery = encodeURIComponent(searchQuery);
    const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=5`
    );
    if (!data) {
        console.log("youtube fail");
        return null;
    }
    if (data.items[0] == undefined) {
        console.log("youtube fail");
        return null;
    }
    return data.items[0].id.videoId;
}