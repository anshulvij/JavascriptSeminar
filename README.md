# JavascriptSeminar
This is the repository for DEMO web applications using Raphael.js and D3.js libraries.
The applications show heat map of Munich based on count of restaurants in each districts.

Hovering over district shows information about restaurant count and district name.

Raphael demo include animation to rotate and scale to 2x factor the district clicked and hide other districts.

While the D3 demo does not have animations but utilizes powerful D3 API to count and categorize restaurant based on cuisine.
D3 the use category data to draw a doughnut chart fo each district.

The restaurant data is collected by using Yelp API(https://www.yelp.com/developers/documentation/v2/search_api) and saved as a
JSON object containing 6000+ restaurants in Munich along with address and geographical coordinates.

Raphael utilize postal code to assign a restaurant to a district while D3 uses longitude and latitude to find the location of 
restaurant.
