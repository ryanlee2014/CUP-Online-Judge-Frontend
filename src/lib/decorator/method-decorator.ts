import _ from "lodash";
export function methodDecorator(wait?: number, options?: any) {
    return function (target: any, propertyName: string, propertyDescriptor: PropertyDescriptor) {
        const method = propertyDescriptor.value;
        propertyDescriptor.value = _.debounce(method, wait, options);
        return propertyDescriptor;
    }
}
