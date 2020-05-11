var JsonRespond = class JsonRespond{

    constructor(){
        this.code = "";
        this.http_code = "";
        this.error = "" ;
        this.message = "";
        this.data={};

        this.CODE_SUCCESS =200;
        this.CODE_BAD_REQUEST =400;
        this.CODE_UNAUTHORIZED =401;
        this.CODE_FORBIDDEN =403;
        this.CODE_SERVICE_UNAVAILABLE =503;
    }

    respondWithError(res, message, errorCode) {
        var respond = this;
        respond.error = message;
        respond.code = this.getCodeDesc(errorCode);
        respond.http_code = errorCode;

        res.status(errorCode).json(respond.getJsonFormat());        
    }

    respondWithOk(res){
        var respond = this;
        respond.message = "OK";
        respond.code = this.getCodeDesc(this.CODE_SUCCESS);
        respond.http_code = this.CODE_SUCCESS;

        res.status(this.CODE_SUCCESS).json(respond.getJsonFormat());
    }

    respondWithData(res, data) {
        var respond = this;
        respond.message = "OK";
        respond.data = data
        respond.code = this.getCodeDesc(this.CODE_SUCCESS);
        respond.http_code = this.CODE_SUCCESS;

        res.status(this.CODE_SUCCESS).json(respond.getJsonFormat());        
    }

    getCodeDesc(code){
        var codeDesc = "NOT_FOUND"
        switch (code) {
            case 200:
                codeDesc = "CODE_SUCCESS";
                break;
            case 400:
                codeDesc = "CODE_BAD_REQUEST";
                break;
            case 401:
                codeDesc = "CODE_UNAUTHORIZED";
                break;
            case 403:
                codeDesc = "CODE_FORBIDDEN";
                break;
            case 503:
                codeDesc = "CODE_SERVICE_UNAVAILABLE";
                break;
        }
        return codeDesc
    }
    
    getJsonFormat(){
        return {
            code: this.code,
            http_code: this.http_code,
            content: {
                data: this.data,
                error: this.error,
                message: this.message
            }
        }
    }
}


module.exports = JsonRespond