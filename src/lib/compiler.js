
class Compiler{
    constructor(){

    }

    saveCode(code){
        return new Promise((resolve, reject) => {
            reject('网页端不支持');
        });
    }

    compile(){
        return new Promise((resolve, reject) => {
            reject('网页端不支持');
        });
    }

    upload(){
        return new Promise((resolve, reject) => {
            reject('网页端不支持');
        });
    }
}

let compiler = new Compiler();

export default compiler;