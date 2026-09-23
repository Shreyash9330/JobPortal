import axios from "axios";

const API = "http://localhost:8080/api/jobs";

export const deleteJob = (id, token) => {
  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
