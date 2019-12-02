import _ from "lodash";

import { log, logFactory } from "@/util/logger";

const decoratorLog = logFactory("Decorator mounted: ");
interface IPropertyDescriptor extends PropertyDescriptor {
    timer_?: any[]
}

interface IWebSocketPropertyDescriptor extends PropertyDescriptor {
    $socket?: any;
    sockets?: any;
}

export function Debounce (wait?: number, options?: any) {
    return function (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
        decoratorLog(`debounce, target:${target}, propertyName:${propertyName}`);
        const method = propertyDescriptor.value;
        propertyDescriptor.value = _.debounce(method, wait, options);
        return propertyDescriptor;
    };
}

export function Interval (wait = 0) {
    return function (target: any, propertyName: string, propertyDescriptor: IPropertyDescriptor) {
        decoratorLog(`Interval, target:${target}, propertyName:${propertyName}`);
        const method = propertyDescriptor.value;
        propertyDescriptor.value = function (...args: any[]) {
            if (typeof this.timer_ === "undefined" || typeof this.timer_.length === "undefined") {
                throw new Error("You should mixin TimerMixin to your component");
            }
            method.apply(this, args);
            this.timer_.push(setInterval(() => { method.apply(this, args); }, wait));
        };
        log("mounted interval");
    };
}

export function Debuglogging (target: any, propertyName: string, propertyDescriptor: IPropertyDescriptor) {
    decoratorLog(`Debuglogging, target:${target}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        const params = args.map(a => JSON.stringify(a)).join();
        const result = method.apply(this, args);
        const r = JSON.stringify(result);
        log(`Call: ${propertyName}(${params}) => ${r}`);
        return result;
    };
}

export function WebSocketRequest (target: any, propertyName: string, propertyDescriptor: IWebSocketPropertyDescriptor) {
    decoratorLog(`WebSocketRequest, target:${target}, propertyName:${propertyName}`);
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
        if (!this.$socket!.connected) {
            alert("WebSocket服务未启动，请等待服务启动后提交\nWebSocket服务启动标志未:\n右上角显示在线人数");
            return;
        }
        return method.apply(this, args);
    };
}
