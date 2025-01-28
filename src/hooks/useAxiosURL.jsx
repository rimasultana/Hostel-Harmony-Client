import axios from "axios";

const axiosURL = axios.create({
  baseURL: "https://hostel-harmony-server.vercel.app/",
});

const useAxiosURL = () => {
  return axiosURL;
};

export default useAxiosURL;
