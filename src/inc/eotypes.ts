


/**
 * 字典项
 */
export interface cdic_item {
    value: number;
    label: string;
}


/**
 * form表单参数
 */
export interface cform_options {
    type: string;
    name: string;

    span: number;
    label: string;

    /** 多行文本行数 */
    row?: number;

    /** 数字输入框 */
    precision?: number;
    step?: number;
    min?: number;
    max?: number;

    /** 字典输入 */
    dic?: string;
    field?: string,
    all?: boolean,

    /** 列表 */
    list?: cdic_item[];
}


export type ctable_func_loading = (b: boolean) => void;
export type ctable_func_item = (d: any) => any;
export type ctable_func_page = (n: number) => number;

/** 确认数据 */
export type cfunc_confirm = (data: any) => any;
/** 传递一个 boolean 类型 */
export type cfunc_boolean = (result: boolean) => void;

export interface ctable_options {
    /** 格式化 */
    on_item?: ctable_func_item;
    /** 分页 */
    on_page?: ctable_func_page;
}

/**
 * 树节点
 */
export interface ctree_node {
    id: number,
    label: string,
    data: any,
    children: ctree_node[]
}

/**
 * 文件项
 */
export interface cfile_item {
    type: string,
    keyid: number,
    index?: number
}

/** 处理文件名 */
export type cfile_func_name = (fileName: string) => string;