import axios from "axios";

const API = "/api/employer";

export const getEmployerDashboard = () => {
  return axios.get(`${API}/dashboard`);
};

export const getEmployerJobs = () => {
  return axios.get(`${API}/jobs`);
};

export const getEmployerApplications = () => {
  return axios.get(`${API}/applications`);
};
