# gridit
======

A single page rails javascript app that helps track utility bills and forecasts the next month's bill using linear regression and temperature correlation to estimate. I used Weather Underground's helpful API to get the monthly average temperatures (*see my note below), and also full credit goes to ShareThrough Engineering for writing the linear regression ruby class code that this app uses; their article can be found here

http://engineering.sharethrough.com/blog/2012/09/12/simple-linear-regression-using-ruby/

With regards to using Weather Undergrounds API, I used the feature called planner to get the historical averages, but it only goes back one year maximum. It turns out that it is pretty common for private weather companies to hoard their historical weather data (or at least from what I can tell). Besides that, I was impressed with the ease to use and documentation with this particular weather API.


## Inspiration
A quick note as to what inspired me for doing this as my final project app at GA.

I've always been fascinated with data and math, and insights the two can provide when thrown together. It also always stressed me out the days leading up to getting the current month's utility bill, especially in the winter when the heating is on. I knew the high correlation between temperature and cost was there and this app validates that hunch, as well as provide a nifty way to keep track.
