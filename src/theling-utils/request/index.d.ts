import { ICallBack, IZlRequestOption } from "../typings";
export type IZlResponse = {
    code: number;
    msg: string;
    message: string;
    result: any;
    url: string;
    status: number;
    statusText: string;
};
declare const zlrequest: (url: string, option?: IZlRequestOption, errorHandler?: (error: IZlResponse, opt: IZlRequestOption) => void, callback?: ICallBack) => Promise<any>;
export default zlrequest;
