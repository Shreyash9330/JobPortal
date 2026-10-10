import axios from "axios";

const API = "/api/applications";

export const getEmployerApplications = (email, token) => {
  return axios.get(`${API}/employer/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateApplicationStatus = (id, status, token) => {
  return axios.put(
    `${API}/${id}/status?status=${status}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};