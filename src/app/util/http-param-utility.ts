import { HttpParams } from "@angular/common/http";
import { NzTableQueryParams } from "ng-zorro-antd/table";
import { CustomHttpParameterCodec } from "../codec/custom-http-parameter-codec";

export function createTableQueryHttpParam(
    tableQueryParams: NzTableQueryParams,
    criteria?: {}
): HttpParams {
    const { pageIndex, pageSize, sort, filter } = tableQueryParams;
    let params = new HttpParams({ encoder: new CustomHttpParameterCodec() });
    params = pageIndex ? params.append('page', `${pageIndex}`) : params;
    params = pageSize ? params.append('size', `${pageSize}`) : params;
    sort?.filter(item => item.value !== null)
        .forEach(item => {
            if (item.value) {
                params = params.append('sort', `${item.key},${item.value == 'ascend' ? 'asc' : 'desc'}`);
            }
        });
    filter?.filter(item => item.value !== null)
        .forEach(item => {
            params = params.append(item.key, item.value);
        });
    if (criteria) {
        Object.entries(criteria)?.filter(([key, value]) => value !== null)
            .forEach(([key, value]) => {
                params = params.append(key, value as any);
            })
    }

    return params;
}