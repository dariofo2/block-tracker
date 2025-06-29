export class ListResponseDatatablesDTO<T> {
    draw: number=0;
    data:T[]=[];
    recordsTotal:number=0;
    recordsFiltered:number=0;

}