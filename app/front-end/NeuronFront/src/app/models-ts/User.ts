
export class UserLogin {
    constructor(
      public Username: string,
      public Password: string
    ) { }
  
  }
export class UserRegister{
  constructor(
    public Username: string,
    public Password: string,
    public Email: string,
    public Ime: string,
    public Prezime: string 
  ){ }
}

export class AdminUser{
  Id:string='';
  UserName:string='';
  Password:string='';
  Email:string='';
  FullName:string='';
}