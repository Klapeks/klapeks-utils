import fs from 'fs';
import mPath from 'path';

class HttpResponse {

    readonly response: any;
    public status: number;
    public headers: any;
    constructor(response: any, status = 200, headers: any = undefined) {
        this.response = response;
        this.status = status;
        this.headers = headers;
    }

    /** @param express Response */
    sendTo(res: any) {
        if (this.headers) res.set(this.headers);
        res.status(this.status).send(this.response);
    }

    toJSON(): any {
        return {
            __class: 'http-response',
            response: this.response,
            status: this.status,
            headers: this.headers
        }
    }

    static fromJSON(json: any) {
        if (json.__class != 'http-response') {
            throw "Not a HttpResponse";
        }
        let res = new HttpResponse(json.response);
        res.status = json.status;
        res.headers = json.headers;
        return res;
    }

    static fromFile(path: string, dirname?: string) {
        if (dirname) {
            path = mPath.join(dirname, path);
            if (!path.startsWith(dirname)) {
                throw "Not isolated path :/";
            }
        }
        if (!fs.existsSync(path)) throw "File not found";
        path = fs.readFileSync(path).toString();
        return new HttpResponse(path);
    } 
}


export default HttpResponse;