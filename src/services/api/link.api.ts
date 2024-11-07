import instance from "./axios";

const getAllLinks = (page?: number, per_page?: number) => {
  return instance.get("/links", {
    params: {
      page,
      per_page,
    },
  });
};

const getLinkDetail = (id: string) => {
  return instance.get(`/links/${id}`);
};

const getAnswersByLinkId = (id: string) => {
  return instance.get(`/links/${id}/answers`);
};

const deleteLinkById = (id: string) => {
  return instance.delete(`/links/${id}`);
};

export const LinkApi = {
  getAllLinks,
  getLinkDetail,
  getAnswersByLinkId,
  deleteLinkById,
};
