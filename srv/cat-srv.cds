using myapp from '../db/schema';

service CatalogService {
  entity countries as projection on myapp.countries;
  entity state as projection on myapp.state;
  entity city as projection on myapp.city;
}


service getSearchHistory {
  entity GETsearchHistory as projection on myapp.searchHistory;
}


service postSearchHistory {
  entity POSTsearchHistory as projection on myapp.searchHistory;
}