namespace myapp;
  entity countries  {
    key country_code: String;      //Primary Key 
    name: String;

  };

  entity state  {
    key state_code: String;
    name: String;
    country_code: String;
    country: Association to countries on country_code = $self.country_code;
    //Association to the 'countries' entity based on country_code

  };

  entity city  {
    key name: String;
    state_code: String;
    country_code: String;
    state: Association to state on state_code = $self.state_code;
    country: Association to countries on country_code = $self.country_code;
  };  

//Annotations @mandatory 

entity searchHistory{
     country:String @mandatory;
     state:String @mandatory;
     city:String  @mandatory;
}

