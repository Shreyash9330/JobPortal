import axios from "axios";

const API = "/api/jobs";

export const deleteJob = (id, token) => {
  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
