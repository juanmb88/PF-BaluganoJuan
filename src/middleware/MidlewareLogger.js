import { logger } from "../helper/Logger.js"

//middleware con el logger
export const middLogger = (req, res, next) => {
    req.logger = logger
  
    next()
  }

