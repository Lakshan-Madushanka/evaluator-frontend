export const get_all_route = (teamId) =>
  `administrative/teams/${teamId}/questionnaires`;

export const get_attach_route = (teamId, questionnaireId) =>
  `administrative/teams/${teamId}/questionnaires/${questionnaireId}/attach`;
