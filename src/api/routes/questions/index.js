const apiURL = import.meta.env.VITE_API_URL;

export const get_one_route = (id) => `administrative/questions/${id}`;
export const get_all_route = "administrative/questions";
export const get_create_route = "administrative/questions";
export const get_update_route = (id) => `administrative/questions/${id}`;
export const get_delete_route = (id) => `administrative/questions/${id}`;
export const get_bulk_delete_route = "administrative/questions/mass-delete";
export const get_route_to_upload_images = (id) =>
  `${apiURL}uploads/questions/${id}`;
export const get_route_to_load_images = (id) =>
  `${apiURL}uploads/questions/${id}`;
export const get_route_to_change_order_of_images =
  "uploads-change-order/questions";
export const get_route_to_remove_images = "uploads-mass-delete/questions";
