export function unique (array: any[]) {
    return array.filter(function (item, index, array) {
        return array.indexOf(item) === index;
    });
}
