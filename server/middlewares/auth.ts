import myError from '../api/myError'

export function isAuthorized (req, res, next) {
  if (!req.session.userId) {
    const error = new myError(
      'unauthorized cookie', 
      401, 
      1, 
      'خطا رخ داد!',
      'لطفا برای ادامه لاگین کنید!'
      )
    next(error)
  } else {
    next()
  }
}

export function isAdmin (req, res, next) {
  if (!req.session.adminId) {
    const error = new myError(
      'unauthorized', 
      401, 
      3, 
      'خطا رخ داد!',
      'شما اجازه دسترسی ندارید!'
      )
    next(error)
  } else {
    next()
  }
}
