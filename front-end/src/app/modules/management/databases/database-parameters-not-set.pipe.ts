import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'databaseParametersNotSet',
  pure: true
})
export class DatabaseParametersNotSetPipe implements PipeTransform {

  transform(parameters: any, args?: any): any {
    console.log(parameters);
    if (parameters) {
      return parameters.filter(x => x.value === null).length;
    }
    return null;
  }

}
