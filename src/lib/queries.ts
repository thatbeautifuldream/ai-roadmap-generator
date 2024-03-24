import { MutationOptions, QueryKey, useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";

const MutationFactory = (
  mutationKey: QueryKey,
  url: string,
  method: "POST" | "PUT" | "PATCH",
  options?: MutationOptions,
) => {
  return useMutation<any, AxiosError, any>({
    mutationKey,
    mutationFn: async (variables: { body: any }) => {
      return axios({
        url,
        method,
        data: variables.body,
      }).then((response: AxiosResponse) => response.data);
    },
    ...options,
  });
};

export const useGenerateRoadmap = (
  query: string,
  model: string,
  modelApiKey: string | null,
  options?: MutationOptions,
) => {
  return MutationFactory(
    ["Generate Roadmap", query],
    `/api/v1/${model}/roadmap?apiKey=${modelApiKey}`,
    "POST",
    options,
  );
};

export const useSearch = (query: string, options?: MutationOptions) => {
  return MutationFactory(
    ["Search Roadmap", query],
    `/api/v1/roadmaps`,
    "POST",
    options,
  );
};
