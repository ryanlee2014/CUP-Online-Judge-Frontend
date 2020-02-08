
interface IKeyValueString {
    [id: string]: string
}

interface ICodeSet extends IKeyValueString {
}

interface IMavonEditorVueComponent extends IKeyValueString{}

interface IKeyValue {
    [id: string]: any
}

interface IPrependAppendPayload {
    language: string,
    code: string
}

interface ICodePayload {
    language: number,
    code: string
}

interface IPrefileDTOPayload {
    payload: ICodePayload[],
    problemId: number | string
}
