import api from "./axios.api";

//create a review
export const createReview = async (data) => {
  const response = await api.post("/reviews", data);
  return response.data;
};

//get reviews for a service
export const getServiceReviews = async (serviceId) => {
  const response = await api.get(`/reviews/service/${serviceId}`);
  return response.data;
};

//update a review
export const updateReview = async (id, data) => {
  const response = await api.put(`/reviews/${id}`);
  return response.data;
};

//delete a review
export const deleteReview = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

//Staff response
export const respondToReview = async (id, staffResponse) => {
  const response = await api.post(`/reviews/${id}/respond`, {
    staffResponse,
  });
  return response.data;
};
