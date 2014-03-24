jord = User.first

# Pass 5 gas bills
gas1 = Bill.create(utility: 'gas', amount: 12.04, bill_period: Date.new(2013, 8, 01), user: jord, temperature: 72)
gas2 = Bill.create(utility: 'gas', amount: 70.42, bill_period: Date.new(2013, 11, 01), user: jord, temperature: 43)
gas3 = Bill.create(utility: 'gas', amount: 104.09, bill_period: Date.new(2013, 12, 01), user: jord, temperature: 34)
gas4 = Bill.create(utility: 'gas', amount: 124.25, bill_period: Date.new(2014, 01, 01), user: jord, temperature: 28)
gas5 = Bill.create(utility: 'gas', amount: 118.46, bill_period: Date.new(2014, 02, 01), user: jord, temperature: 29)

# Pass 5 electric bills
electric1 = Bill.create(utility: 'electric', amount: 17.02, bill_period: Date.new(2013, 8, 01), user: jord, temperature: 72)
electric2 = Bill.create(utility: 'electric', amount: 47.05, bill_period: Date.new(2013, 11, 01), user: jord, temperature: 43)
electric3 = Bill.create(utility: 'electric', amount: 41.65, bill_period: Date.new(2013, 12, 01), user: jord, temperature: 34)
electric4 = Bill.create(utility: 'electric', amount: 52.86, bill_period: Date.new(2014, 01, 01), user: jord, temperature: 28)
electric5 = Bill.create(utility: 'electric', amount: 41.19, bill_period: Date.new(2014, 02, 01), user: jord, temperature: 29)
