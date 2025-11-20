import axios from "axios";

export const fetchJobsFromAPI = async (
  query: string,
  page: number = 1,
  params: any = {}
) => {
  try {
    const response = await axios.get(
      `https://${process.env.RAPIDAPI_HOST}/search`,
      {
        params: {
          query,
          page,
          num_pages: 1,
          date_posted: params.datePosted || "today",
          country: params.country || "in",
          employment_types: params.employmentTypes?.join(","),
          job_requirements: params.jobRequirements,
          radius: params.radius,
          work_from_home: params.remote,
        },
        headers: {
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
          "x-rapidapi-host": process.env.RAPIDAPI_HOST!,
        },
      }
    );

    return response.data.data || [];
  } catch (error: any) {
    console.error("RapidAPI Fetch Error:", error.response?.data || error);
    return [];
  }
};
