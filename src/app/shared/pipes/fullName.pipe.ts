import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullName',
})
export class FullNamePipe implements PipeTransform {
  transform(
    value: { firstName: string; lastName: string },
    locale: 'fr' | 'en' = 'fr'
  ) {
    return locale === 'fr'
      ? `${value.lastName.toUpperCase()} ${value.firstName[0].toUpperCase()}${value.firstName
          .substring(1)
          .toLowerCase()}`
      : `${value.firstName} ${value.lastName}`;
  }
}
