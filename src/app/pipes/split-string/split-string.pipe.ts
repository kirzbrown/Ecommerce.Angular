import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  transform(value:string, [separator]:string, index:number=null):string {
    let splits = value.split(separator);
    if(index < splits.length && index > -1) {
      return splits[index ?? 0];
    }
  }
}
