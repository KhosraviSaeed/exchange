export const API = "http://127.0.0.1:3001";
// export const API = 'http://192.168.1.9'

export const SOCKET = `${API}/onlineLoginUsers`

export const BASE_IMAGE = `${API}/service/getImages`;

export const LOGIN_API = `${API}/auth/login`;
export const LOGOUT_API = `${API}/auth/logout` 

export const GET_DASH_CARD_PRICES = (type) => `${API}/service/getCurrencies?type=${type}` 

export const GET_LAST_TXS = `${API}/service/filterOnTxs`
export const GET_LAST_DEFAULT_TXS = (query) => `${API}/service/getDeafultAcceptedOffers?curIdOp=${query.curIdOp}`
export const CREATE_OFFER = `${API}/user/createOffer`

export const GET_ACTIVE_OFFERS = (curIdOp) => `${API}/service/getActiveOffers?curIdOp=${curIdOp}`
export const GET_USER_ACTIVE_OFFERS = (curIdOp) => `${API}/user/getUserActiveOffers?curIdOp=${curIdOp}`
export const ACCEPT_OFFER = (offerId) => `${API}/user/acceptOffer?offerId=${offerId}`
export const WITHDRAW_OFFERS = `${API}/user/withdrawOffer`

export const GET_USER_WALLET = `${API}/user/getUserWallet`
export const GET_LAST_PRICE = `${API}/user/getPrice`
export const BUY_CURRENCY = `${API}/wallet/buyCurrency`
export const SELL_CURRENCY = `${API}/wallet/sellCurrency`

export const GET_USER_TICKETS = `${API}/tickets/getTickets`
export const CREATE_TICKET = `${API}/tickets/createTicket`
export const ADD_COMMENT_TO_TICKET = `${API}/tickets/addCommentToTicket`
export const DELETE_TICKETS = `${API}/tickets/deleteTickets`



// General Info
export const WEBSITE_TITLE = "صرافی دیجیتال";

// LINKS
export const LINK_LOGIN = '/login'

export const LINK_DASHBOARD = '/dashboard'
export const LINK_PROFILE = '/profile'
export const LINK_WALLET = '/wallet'
export const LINK_CHARTS = '/charts'
export const LINK_WALLET_CUR_DETAILS = '/walletCurDetails'
export const LINK_TICKETS = '/tickets'
