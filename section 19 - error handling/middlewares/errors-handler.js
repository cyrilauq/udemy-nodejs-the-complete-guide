module.exports = (error, req, res, next) => {
    if(error.httpStatusCode){
        res.status(error.httpStatusCode).render(`${error.httpStatusCode}`);
    }
    res.status(500).render(`500`);
}