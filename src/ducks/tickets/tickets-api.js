import axios from "axios";
import {
  CREATE_TICKET,
  ADD_COMMENT_TO_TICKET,
  GET_USER_TICKETS,
  DELETE_TICKETS
} from "../../configs/constants-config";

export {
  createTicket,
  addCommentToTicket,
  getUserTickets,
  deleteTickets
};

function createTicket(data) {
  return axios.post(CREATE_TICKET, data, { withCredentials: true });
}

function deleteTickets(data) {
  return axios.post(DELETE_TICKETS, data, { withCredentials: true });
}

function addCommentToTicket(data) {
  return axios.post(ADD_COMMENT_TO_TICKET, data, { withCredentials: true });
}

function getUserTickets() {
  return axios.get(GET_USER_TICKETS, { withCredentials: true });
}







