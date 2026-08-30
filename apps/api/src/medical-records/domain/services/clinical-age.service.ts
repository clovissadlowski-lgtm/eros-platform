export interface ClinicalAgeInput {
  birthDate: string;
  referenceDate: string;
}

export interface ClinicalAgeResult {
  years: number;
  months: number;
  totalMonths: number;
}

export class ClinicalAgeService {
  calculate(
    input: ClinicalAgeInput,
  ): ClinicalAgeResult {
    const birthDate =
      this.parseDate(
        input.birthDate,
        'birthDate',
      );

    const referenceDate =
      this.parseDate(
        input.referenceDate,
        'referenceDate',
      );

    if (
      referenceDate.getTime() <
      birthDate.getTime()
    ) {
      throw new Error(
        'referenceDate must be on or after birthDate.',
      );
    }

    let years =
      referenceDate.getUTCFullYear() -
      birthDate.getUTCFullYear();

    let months =
      referenceDate.getUTCMonth() -
      birthDate.getUTCMonth();

    const referenceDay =
      referenceDate.getUTCDate();

    const birthDay =
      birthDate.getUTCDate();

    if (
      referenceDay <
      birthDay
    ) {
      months -= 1;
    }

    if (
      months < 0
    ) {
      years -= 1;
      months += 12;
    }

    const totalMonths =
      years * 12 +
      months;

    return {
      years,
      months,
      totalMonths,
    };
  }

  private parseDate(
    value: string,
    fieldName: string,
  ): Date {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        value,
      )
    ) {
      throw new Error(
        `${fieldName} must use YYYY-MM-DD format.`,
      );
    }

    const [
      year,
      month,
      day,
    ] =
      value
        .split('-')
        .map(Number);

    const date =
      new Date(
        Date.UTC(
          year,
          month - 1,
          day,
        ),
      );

    if (
      date.getUTCFullYear() !==
        year ||
      date.getUTCMonth() !==
        month - 1 ||
      date.getUTCDate() !==
        day
    ) {
      throw new Error(
        `${fieldName} must be a valid calendar date.`,
      );
    }

    return date;
  }
}