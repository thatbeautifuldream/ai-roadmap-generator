"use server";
import axios from "axios";

export async function knowledgeGraph(searchQuery: string) {
  searchQuery = encodeURIComponent(searchQuery);
  const { data } = await axios.get(
    `https://kgsearch.googleapis.com/v1/entities:search?query=${searchQuery}&key=${process.env.KNOWLEDGE_GRAPH_SEARCH_KEY}&limit=1&indent=True`
  );
  if (!data) {
    console.log("The Knowledge Graph API returned no data");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("No data found");
    return null;
  }
  return data.items[0].id.videoId;
}

// https://kgsearch.googleapis.com/v1/entities:search?query=typescript&key=AIzaSyBtmiANpppD-zvae7byyoIxMPMnDr-zr8Y&limit=1&indent=True
