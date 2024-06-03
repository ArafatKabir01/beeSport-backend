const getUserIP = async (req, res, next) => {
    const publicIP =
      req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
  
    req.userIp = publicIP;
    next();
  };
  
  module.exports = getUserIP;