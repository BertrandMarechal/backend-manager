import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'databaseParametersNotSet'
})
export class DatabaseParametersNotSetPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
