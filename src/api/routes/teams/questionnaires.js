export const get_all_route = (userId) =>
  `administrative/users/${userId}/questionnaires`;

export const get_attach_route = (teamId, questionnaireId) =>
  `administrative/teams/${teamId}/questionnaires/${questionnaireId}/attach`;
