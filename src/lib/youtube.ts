import axios from "axios";
// TODO: install this library and use
// import { YoutubeTranscript } from "youtube-transcript";

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

export async function getTranscript(videoId: string) {
    try {
        // let transcript_arr = await YoutubeTranscript.fetchTranscript(videoId, {
        //     lang: "en",
        //     country: "EN",
        // });
        // let transcript = "";
        // for (let t of transcript_arr) {
        //     transcript += t.text + " ";
        // }
        // return transcript.replaceAll("\n", "");
    } catch (error) {
        // return "";
    }
}