import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOnEnvironment'
})
export class FilterOnEnvironmentPipe implements PipeTransform {

  transform(values: {environment: string}[], environment: string): any {
    if (values && environment) {
      return [
        ...values.filter(x => x.environment === environment || x.environment === null)
      ];
    }
    return null;
  }

}
