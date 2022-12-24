export class LoyaltySystem {
  constructor(
    public percentages: number[] = [5, 10, 15, 20],
    public ages: string[] = ['Childish', 'Juvenile', 'Adult', 'Senior'],
    public numAquisitions: number[] = [5, 10, 15, 20],
    public numSoldBooks: number[] = [5, 10, 15, 20]
  ) {}
}
