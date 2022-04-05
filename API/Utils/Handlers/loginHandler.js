
exports.loginHandler = {

    getToken(req,res){
        console.log('hi')
        res.send({
            token:"nivsToken"
        })
    }
}