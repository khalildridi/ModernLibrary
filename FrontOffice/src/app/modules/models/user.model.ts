export class User {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  contact?: number;
  date_of_birth?: Date;
  avatar?: string;
  address?: {
    street: string;
    city: string;
    district: string;
    zipCode: string;
  };
  purchases?: [
    {
      _id: string;
      date: Date;
      shipping: number;
      discount: number;
      totalPrice: number;
      books: [
        {
          _id: string;
          title: string;
          cover: string;
          price: number;
          new: number;
          worn: number;
          date: Date;
        }
      ];
    }
  ];
  role?: string;
  points?: number;
}
