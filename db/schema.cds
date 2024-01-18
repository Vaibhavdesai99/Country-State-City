namespace myapp;
  entity countries  {
    key id :UUID;
    country_code: String;     
    name: String;

  };

  entity state  {
   key id:UUID;
    state_code: String;
    name: String;
    country_id:UUID;
    country: Association to countries on  id  = $self.country_id;
  

  };

  entity city  {
    key id :UUID;
    name: String;
   state_id:UUID;
   country_id:UUID;
    state: Association to state on id = $self.state_id;
    country: Association to countries on id = $self.country_id;
  };  

//Annotations @mandatory 

entity searchHistory{
     key id :UUID;
     country:String @mandatory;
     state:String @mandatory;
     city:String  @mandatory;
}

