import * as userQuestionnairesRoutes from "@/api/routes/users/questionnaires";

import http from "@/http";

export async function attach(userId, questionnaireid) {
  const response = await http.post(
    userQuestionnairesRoutes.get_attach_route(userId, questionnaireid)
  );

  return response;
}
