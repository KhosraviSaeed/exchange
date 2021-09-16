import * as express from 'express';
import * as fetch from 'node-fetch'
import * as mongoose from 'mongoose'
import { logger } from '../api/logger'
import myError from '../api/myError'

import { isAuthorized } from '../middlewares/auth'
import successRes from '../middlewares/response'
import { userValidationRules, validate } from '../middlewares/validation'
import tryCatch from '../middlewares/tryCtach'
import { rateLimiterMiddleware } from '../middlewares/preventBruteForce'

import { User } from '../db/user'
import { ObjectID } from 'mongodb';
import * as _ from 'lodash';


var MongoClient = require('mongodb').MongoClient


const mongoClient = new MongoClient(process.env.MONGO_DATABASE, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
const connection = mongoClient.connect()
var dbo = mongoClient.db(process.env.MONGO_DATABASE_NAME_TICKETS)


export const ticketRoutes = express.Router()


/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
// connection.then(() => {
//   var dbo = mongoClient.db(process.env.MONGO_DATABASE_NAME)
//   dbo.collection('messages').watch().on('change', next => {
//     const message = next.fullDocument;
//     const ownerId = message.owner
//     dbo.collection('accounts').findOne({ _id: ownerId }, (err, account) => {
//       const email = account.email
//       client.smembers(email, (err, reply) => {
//         const socketIds = reply
//         socketIds.forEach((socketId) => {
//           onlineLoginUsers.to(socketId).emit('my_new_message', message)
//         })
//       })
//     })
//   })
// })

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// GET ENDPOINTS   /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

ticketRoutes.get('/getTickets', 
isAuthorized, 
tryCatch((req, res, next) => {
  const userId = req.session.userId
  let newTicketsArr = []
  let openTicketsArr = []
  let pendingTicketsArr = []
  let closedTicketsArr = []
  connection.then(() => {
    dbo.collection('accounts').findOne({ userId: new ObjectID(userId) })
      .then((account) => {
        if (account && account.userId.toString() === userId) {
          const ownerId = account._id
            dbo.collection('tickets').find({ owner: ownerId }).toArray()
              .then((tickets) => {
                const ticketsArr = tickets.map((e) => {
                  const comments = e.comments.map((elm) => {
                    if(elm.owner.toString() === ownerId.toString()) {
                      elm['ownerType'] = 'User'
                    } else {
                      elm['ownerType'] = 'Admin'
                    }
                    return elm
                  })
                  const sortedComments = _.orderBy(comments, ['date'], ['desc'])
                  switch (e.status) {
                    case 0:
                      newTicketsArr.push(                    
                        {
                          _id: e._id,
                          status: 'جدید',
                          date: e.date,
                          subject: e.subject,
                          issue: e.issue,
                          comments: sortedComments
                        }
                      )
                      break;
                    case 1:
                      openTicketsArr.push(                    
                        {
                          _id: e._id,
                          status: 'باز',
                          date: e.date,
                          subject: e.subject,
                          issue: e.issue,
                          comments: sortedComments
                        }
                      )
                      break;
                    case 2:
                      pendingTicketsArr.push(                    
                        {
                          _id: e._id,
                          status: 'منتظر پاسخ',
                          date: e.date,
                          subject: e.subject,
                          issue: e.issue,
                          comments: sortedComments
                        }
                      )
                      break;
                    case 3:
                      closedTicketsArr.push(                    
                        {
                          _id: e._id,
                          status: 'بسته',
                          date: e.date,
                          subject: e.subject,
                          issue: e.issue,
                          comments: sortedComments
                        }
                      )
                      break;
                  
                    default:
                      break;
                  }                  
                })
                Promise.all(ticketsArr)
                .then(() => {
                  const modifiedTickets = {
                    newTickets: {
                      newTicketsArr,
                      quantity: newTicketsArr.length
                    },
                    openTickets: {
                      openTicketsArr,
                      quantity: openTicketsArr.length
                    },
                    pendingTickets: {
                      pendingTicketsArr,
                      quantity: pendingTicketsArr.length
                    },
                    closedTickets: {
                      closedTicketsArr,
                      quantity: closedTicketsArr.length
                    }
                  }
                  console.log(modifiedTickets)
                  successRes(res, 'The tickets are sent', modifiedTickets)
                })
                .catch((err) => {
                  next(err)
                })
              })
              .catch((err) => {
                next(err)
              })
        } else {
          const error = new myError(
            'The user does not have ticket account!',
            400,
            43,
            'کاربر دارای حساب تیکتینگ نیست!',
            'خطا رخ داد'
          )
          next(error)
        }
      })
      .catch((err) => {
        next(err)
      })
  })
    .catch((err) => {
      next(err)
    })
}))

ticketRoutes.get('/startConversation',
isAuthorized, 
tryCatch((req, res, next) => {
  const userId = req.session.userId
  connection.then(() => {
    dbo.collection('accounts').findOne({ userId: userId })
      .then((user) => {
        if (user && user.userId.toString() === userId) {
          const ownerId = [user._id]
          const accessToken = user.accessToken
          const supportId = []
          dbo.collection('accounts').find({ role: process.env.SUPPORT_ROLE_ID }).toArray()
            .then((docs) => {
              if (docs && docs.length > 0) {
                const docMap = docs.map((doc) => {
                    supportId.push(doc._id)
                })
                Promise.all(docMap)
                  .then(() => {
                    const participants = ownerId.concat(supportId)
                    const body1 = {
                      owner: ownerId,
                      participants: participants
                    }
                    const bodyJson = JSON.stringify(body1)
                    fetch(process.env.TICKET_START_CONVERSATION, {
                      method: 'POST',
                      body : bodyJson,
                      headers: {
                        accessToken: accessToken,
                        'Content-Type': 'application/json'
                      }
                    })
                    .then(res => res.json())
                    .then((response) => {
                      if (response.success === true && response.conversation.participants.length > 1) {
                        logger.info(`A conversation starts successfully for user ${userId} by id ${response.conversation._id}`)
                        successRes(res, 'Conversation started successfully!', response.conversation._id)
                      }
                    })
                    .catch((err) => {
                      next(err)
                    })
                  })
              } else {
                const error = new myError(
                  'There is no supporter!',
                  400,
                  43,
                  'هیچ پشتیبانی ثبت نشده است!',
                  'خطا رخ داد'
                )
                next(error)
              }
            })
            .catch((err) => {
              next(err)
            })
          } else {
          const error = new myError(
            'The user does not have valid ticket account!',
            400,
            45,
            'کاربر دارای حساب تیکتینگ نیست!',
            'خطا رخ داد'
          )
          next(error)
        } 
      })
      .catch((err) => {
        next(err)
      })
    })
    .catch((err) => {
      next(err)
    })
}))

ticketRoutes.post('/deleteTickets',
isAuthorized, 
// userValidationRules('body', 'ticketIdArray'),
// validate,
tryCatch( (req, res, next) => {
  const userId = req.session.userId
  const ticketIdArray = req.body.ticketIdArray
  connection.then(() => {
    dbo.collection('accounts').findOne({ userId: new ObjectID(userId) })
      .then(async (user) => {
        if (user && user.userId.toString() === userId) {
          const ownerId = user._id
          const accessToken = user.accessToken;
          let ticketObjectIdArray = []
          await ticketIdArray.map((elemet)=>{
            ticketObjectIdArray.push(new ObjectID(elemet))
          })
          dbo.collection('tickets').updateMany(
            { 
              $and : [{ _id: { $in: ticketObjectIdArray } }, { owner : new ObjectID(ownerId) }] 
            },
            {
              $set:{  deleted  : true}
            }
          )
          .then((result) => {
            if(result&&result.matchedCount !=0){
              if(result.modifiedCount>0){
                successRes(res, 'More than 1 tickets deleted!')
              }
              else {
                successRes(res, 'The ticket were deleted before')
              }
            }
            else {
            const error = new myError(
              'There is no ticket with your id , and requested ticketid array!',
              400,
              43,
              'تیکتی با اسم شما و همچنین با ایدی ورودی پیدا نشد!',
              'خطا رخ داد'
            )
            next(error)
            }
          })
          .catch((err) => {
            next(err)
          })
        } else {
        const error = new myError(
          'The user does not have valid ticket account!',
          400,
          45,
          'کاربر دارای حساب تیکتینگ نیست!',
          'خطا رخ داد'
        )
        next(error)
      } 
    })
    .catch((err) => {
      next(err)
    })
  })
  .catch((err) => {
    next(err)
  })
}))

ticketRoutes.get('/updateTicketStatus',
isAuthorized,
userValidationRules('query', 'ticketId'),
userValidationRules('query', 'ticketStatus'),
validate,
tryCatch(async (req, res, next) => {
  const userId = req.session.userId
  const ticketId = req.query.ticketId
  const status = req.query.ticketStatus
  
  connection.then(() => {
    dbo.collection('accounts').findOne({ userId: new ObjectID(userId) })
      .then((user) => {
        if (user && user.userId.toString() === userId) {
          const ownerId = user._id

          dbo.collection('tickets').updateOne({ _id: new ObjectID(ticketId), owner: new ObjectID(ownerId) }, { $set :{ status : Number(status) } })
            .then(async (result) => {                
              if(result && result.matchedCount !=0) {
                if(result.modifiedCount === 1) {
                  successRes(res, 'The ticket status is changed successfully!')
                } else {
                  successRes(res, 'The ticket status is the same was before!')
                }
              } else {
              const error = new myError(
                'There is no ticket with your id , and requested ticketid!',
                400,
                43,
                'تیکتی با اسم شما و همچنین با ایدی ورودی پیدا نشد!',
                'خطا رخ داد'
              )
              next(error)
              }
            })
            .catch((err) => {
              next(err)
            })
          } else {
          const error = new myError(
            'The user does not have valid ticket account!',
            400,
            45,
            'کاربر دارای حساب تیکتینگ نیست!',
            'خطا رخ داد'
          )
          next(error)
        } 
      })
      .catch((err) => {
        next(err)
      })
    })
    .catch((err) => {
      next(err)
    })
}))


ticketRoutes.get('/getMessages', 
isAuthorized, 
tryCatch((req, res, next) => {
  const userId = req.session.userId
  connection.then(() => {
    dbo.collection('accounts').findOne({ userId: userId })
      .then((doc) => {
        if (doc && doc.userId.toString() === userId) {
          const accessToken = doc.accessToken
          fetch(process.env.TICKET_GET_MESSAGES_URL, {
            method: 'GET',
            headers: {
              accessToken: accessToken,
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then((response) => {
            if (response.success === true) {
              logger.info(`The messages of user ${userId} is gotten successfully`)
              successRes(res, 'The messages is gotten successfully!')
            } else {
              const err = (response.error && response.error.message) ? response.error.message : ''
              logger.warn(`Getting messages for user ${userId} had some problems:` + ' ' + err)
              const error = new myError(
                'Error happened during the getting messages!',
                500,
                48,
                'در به دست آوردن پیام ها مشکلی پیش آمده است.',
                'خطا رخ داد'
                )
              next(error)
            }
          })
          .catch((err) => {
            next (err)
          })
        } else {
          const error = new myError(
            'The user does not have valid ticket account!',
            400,
            45,
            'کاربر دارای حساب تیکتینگ نیست!',
            'خطا رخ داد'
          )
          next(error)
        }         
      })
      .catch((err) => {
        next(err)
      })
    })
    .catch((err) => {
      next(err)
    })
}))

ticketRoutes.post('/register', 
//isAuthorized,
tryCatch(async (req, res, next) => {
  const userId = req.body.userId
  const session  = await mongoose.startSession()
  connection.then(() => {
    dbo.collection('groups').findOne({}, { session })
    .then((group) => {
      if (group && group._id ) {
        const body1 = {
          aUsername: req.body.aUsername,
          aPass: req.body.aPass,
          aPassConfirm: req.body.aPassConfirm,
          aFullname: req.body.aFullname,
          userId : req.body.userId,
          aTitle: req.body.aTitle,
          aGrps: [group._id.toString()],
          aRole: process.env.USER_ROLE_ID,
          aEmail: req.body.aEmail
        }
        const body1Json = JSON.stringify(body1)
        fetch("http://localhost:8118/api/v1/users/create", {
          method: 'POST',
          body: body1Json,
          headers: {
          accessToken: process.env.ACCESS_TOKEN,
          'Content-Type': 'application/json'
          }
        })
        .then((res) => res.json())
        .then((response) => {
          if (response.success === true) {
            const supportId = []
            connection.then(() => {
              dbo.collection('accounts').find({role : new ObjectID("5fb21707795091261c6d2192")}).toArray()
                .then((docs) => {
                  if (docs && docs  .length > 0) {
                    const docMap = docs.map((doc) => {
                      supportId.push(doc._id)
                    })
                    Promise.all(docMap)
                      .then(() => {
                        session.withTransaction(async () => { 
                          const participants = group.members.concat(supportId)  
                          return User.findOne({ _id: userId })
                          .then(async (user) => {
                            if (user && user._id.toString() === userId.toString()) {
                              group.members = participants
                            } else {
                              const error = new myError(
                                'The user does not have valid ticket account!',
                                400,
                                45,
                                'کاربر دارای حساب تیکتینگ نیست!',
                                'خطا رخ داد'
                              )
                              throw(error)
                            }
                          })
                          .catch((err)=>{
                            throw(err)
                          })
                        })
                        .then(() => {
                          successRes(res, 'The ticket account is created successfully!')
                        })
                        .catch((err) => {

                            logger.error(err)
                            throw(err)
                        })
                        .finally(() => {
                            session.endSession()
                        })    
                      })
                      .catch((err) => {
                        next(err)
                      })
                  } else {
                    const error = new myError(
                      'There is no supporter!',
                      400,
                      43,
                      'هیچ پشتیبانی ثبت نشده است!',
                      'خطا رخ داد'
                    )
                    next(error)
                  }
                })
                .catch((err) => {
                  next(err)
                })
            })
          } else {
            logger.warn(`Ticket account Could not be created for user with email ${userId}`)
            const error = new myError(
              'Error happened during the creating ticket account!',
              500,
              49,
              'در ایجاد تیکت مشکلی پیش آمده است!',
              'خطا رخ داد'
            )
            next(error)
          }
        })
        .catch((err) => {
          next(err)
        })
      }
    })
    .catch((err) => {
      next(err)
    })
  })
  .catch((err) => {
    next(err)
  })
}))
    

/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////// POST ENDPOINTS  /////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////
/// ///////////////////////////////////////////////////////////////////////////////////////////////

ticketRoutes.post('/createTicket',
  isAuthorized,
  userValidationRules('body', 'ticketSubject'),
  userValidationRules('body', 'ticketType'),
  userValidationRules('body', 'ticketIssue'),
  userValidationRules('body', 'ticketPriority'),
  validate,
  tryCatch((req, res, next) => {
    const userId = req.session.userId
    const subject = req.body.ticketSubject
    const type = req.body.ticketType
    const issue = req.body.ticketIssue
    const priority = req.body.ticketPriority
    let priorityId
    let typeId
    let groupId
    let accessToken
    let objectId
    const findPriority = () => {
      return dbo.collection('priorities').findOne({ name: priority })
      .then((priorityDoc) => {
        if (priorityDoc && priorityDoc.name === priority) {
          priorityId = priorityDoc._id
        } else {
          const error = new myError(
            'Priority is not valid!',
            400,
            57,
            'اولویت دارای اعتبار نیست!',
            'خطا رخ داد'
            )
          throw error
        }
      })
      .catch((err) => {
        throw(err)
      })
    }
    const findType = () => {
     return dbo.collection('tickettypes').findOne({ name: type })
      .then((typ) => {
        if (typ && typ.name === type) {
          return typeId = typ._id
        } else {
          const error = new myError(
            'Type is not valid!',
            400,
            57,
            'اولویت دارای اعتبار نیست!',
            'خطا رخ داد'
            )
          throw error
        }
      })
      .catch((err) => {
        throw(err)
      })
    }
    const findGroup = () => {
    return  dbo.collection('groups').findOne({ name :"Exchange" })
      .then((group) => {
        if (group && group.name === "Exchange") {    
          return groupId = group._id
        } else {
          const error = new myError(
            'Group is not valid!',
            400,
            57,
            'گروه دارای اعتبار نیست!',
            'خطا رخ داد'
            )
          throw error
        }
      })
      .catch((err) => {
        throw(err)
      })
    }

    const findAccount = () => {
    return dbo.collection('accounts').findOne({ userId: new ObjectID(userId) })
      .then((account) => {
        console.log(account)
        if (account && account.userId.toString() === userId) {
          accessToken = account.accessToken
            return objectId = account._id
        } else {
          const error = new myError(
            'user address is not valid!',
            400,
            12,
            'کاربر دارای حساب تیکتینگ نیست',
            'خطا رخ داد'
          )
          throw error
        }
      })
      .catch((err) => {
        throw err
      })
    }

    connection.then(() => {
      return Promise.all([findAccount(), findGroup(), findPriority(), findType()])
        .then(() => {
          const body = {
            subject: subject,
            issue: issue,
            owner: objectId,
            group: groupId,
            type: typeId,
            priority: priorityId,
            tags: []
          }
          const bodyJson = JSON.stringify(body)
          console.log('bodyJson: ', bodyJson)
          fetch(process.env.TICKET_CREATE_TICKET_URL, {
            method: 'POST',
            body: bodyJson,
            headers: {
              accessToken: accessToken,
              'Content-Type': 'application/json'
            }
          }) 
          .then((res) => res.json())
          .then((response) => {
            if (response.success === true) {
              logger.info(`The ticket ${response.ticket._id} for user ${userId} is created successfully`)
              successRes(res, 'Ticket created successfully!')
            } else {
              logger.error('Error happened during creating ticket account!' + ' ' + response.body)
              const error = new myError(
                'Error happened during the creating ticket account!',
                500,
                49,
                'در ایجاد تیکت مشکلی پیش آمده است!',
                'خطا رخ داد'
              )
              next(error)
            }
          })
          .catch((err) => {
            next(err)
          })         
        })
        .catch((err) => {
          next(err)
        })
      })
      .catch((err) => {
        next(err)
      })
  }))

ticketRoutes.post('/addCommentToTicket',
  isAuthorized,
  userValidationRules('body', 'ticketId'),
  userValidationRules('body', 'ticketComment'),
  validate,
  tryCatch((req, res, next) => {
    const userId = req.session.userId
    const ticketId = req.body.ticketId
    const comment = req.body.ticketComment
    let canAddComment = false
    let findRole = () => {
      return null
    }
    connection.then(() => {
      dbo.collection('accounts').findOne({ userId: new ObjectID(userId) })
        .then((doc) => {
          if (doc && doc.userId.toString() === userId.toString()) {
            dbo.collection('tickets').findOne({ _id: new ObjectID(ticketId) })
            .then((theTicket) => {
              if (theTicket && theTicket._id.toString() === ticketId) {
                console.log('theTicket.owner: ', theTicket.owner)
                if(theTicket.owner.toString() === doc._id.toString()) {
                  canAddComment = true
                } else {
                  findRole = () => {
                    return dbo.collection('roles').findOne({ _id: new ObjectID(doc.roleId) })
                    .then((theRole) => {
                      if (theRole && theRole.name !== 'User') {
                        canAddComment = true
                      }
                    })
                    .catch((err) => {
                      throw(err)
                    })
                  }
                }
                Promise.all([findRole()])
                .then(() => {
                  if (canAddComment) {
                    const accessToken = doc.accessToken
                    const body = {
                      _id: ticketId,
                      ticketId : false,
                      note : false,
                      owner: doc._id,
                      comment: comment
                    }
                    const bodyJson = JSON.stringify(body)
                    fetch(process.env.TICKET_ADD_COMMENT_URL, {
                      method: 'POST',
                      body: bodyJson,
                      headers: {
                        accessToken: accessToken,
                        'Content-Type': 'application/json'
                      }
                    })
                    .then((res) => res.json())
                    .then((response) => {
                      if (response.success === true) {
                        logger.info(`A comment for ticket ${response.ticket._id} for user ${userId} is added successfully`)
                        successRes(res, 'Comment added successfully!')
                      } else {
                        logger.warn(`Creating ticket for user ${userId} had some problems:` + ' ' + response.error.message)
                        const error = new myError(
                          'Error happened during the creating ticket account!',
                          500,
                          49,
                          'در ایجاد تیکت مشکلی پیش آمده است!',
                          'خطا رخ داد'
                        )
                        next(error)
                      }
                    })
                    .catch((err) => {
                      next(err)
                    })
                  } else {
                    const error = new myError(
                      'The user does not have authority!',
                      400,
                      62,
                      'شما مجاز به انجام چنین کاری نیستید!',
                      'خطا رخ داد'
                      )
                    next(error)
                  }
                })
                .catch((err) => {
                  next(err)
                })
              } else {
                const error = new myError(
                  'ticketId is not valid!',
                  400,
                  62,
                  'چنین تیکتی در سیستم ثبت نشده است!',
                  'خطا رخ داد'
                  )
                next(error)
              }
            })
            .catch((err) => {
              next(err)
            })
          } else {
            const error = new myError(
              'OwnerId is not valid!',
              400,
              62,
              'کاربر دارای حساب تیکتینگ نیست!',
              'خطا رخ داد'
              )
            next(error)
          } 
        })
        .catch((err) => {
          next(err)
        })
    })
    .catch((err) => {
      next(err)
    })
  }))

ticketRoutes.post('/sendMessages',
  isAuthorized,
  // userValidationRules('body', 'message'),
  // validate,
  tryCatch((req, res, next) => {
    const userId = req.session.userId
    const message = req.body.message
    connection.then(() => {
      dbo.collection('accounts').findOne({ userId: userId })
        .then((doc) => {
          if (doc && doc.userId.toString() === userId) {
            const ownerId = doc._id
            const accessToken = doc.accessToken
              dbo.collection('conversations').findOne({ 'userMeta.userId': ownerId })
                .then((conversation) => {
                  const conversationId = conversation._id
                  const body = {
                    owner: ownerId,
                    cId: conversationId,
                    body: message
                  }
                  const bodyJson = JSON.stringify(body)
                  fetch(process.env.TICKET_SEND_MESSAGE_URL, {
                    method: 'POST',
                    body: bodyJson,
                    headers: {
                      accessToken: accessToken,
                      'Content-Type': 'application/json'
                    }
                  })
                  .then((res) => res.json())
                  .then((response) => {
                    if (response.success === true) {
                      logger.info(`The message for user ${userId} is sent successfully`)
                      successRes(res, 'The message is sent successfully!')
                    } else {
                      const err = (response.error && response.error.message) ? response.error.message : ''
                      logger.warn(`Sending message for user ${userId} had some problems:` + ' ' + err)
                      const error = new myError(
                        'Error happened during the creating ticket account!',
                        500,
                        49,
                        'در ایجاد تیکت مشکلی پیش آمده است!',
                        'خطا رخ داد'
                      )
                      next(error)
                    }
                  })
                  .catch((err) => {
                    next(err)
                  }) 
                })
                .catch((err) => {
                    next(err)
                })
          } else {
            const error = new myError(
              'The user does not have valid ticket account!',
              400,
              45,
              'کاربر دارای حساب تیکتینگ نیست!',
              'خطا رخ داد'
            )
            next(error)
          } 
        })
        .catch((err) => {
          next(err)
        })
      })
      .catch((err) => {
        next(err)
      })
  }))

