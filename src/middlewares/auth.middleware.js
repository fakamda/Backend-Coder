import passport from 'passport'

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function(err, user, info) {
            if (err) return next(err);
            if (info && info.name === "TokenExpiredError") {
                return res.status(401).json({ status: "error", error: "The token expired" });
            }
            if (!user) {
                
                req.user = { role: "PUBLIC" }
                return next()
            }
            
            req.user = user;
            next();
        })(req, res, next);
    }
}

export const handlePolicies = allowedRoles => (req, res, next) => {
    const user = req.user || { role: "PUBLIC" }; 
    if (user && user.role && !allowedRoles.includes(user.role.toUpperCase())) {
        return res.status(403).json({
            status: "error",
            error: "Your role has no permission to do this action",
        });
    }
    
    return next();
};
