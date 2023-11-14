#!/usr/bin/env python

import csv
import random
from datetime import timedelta, datetime
from faker import Faker

fake = Faker()

# Define the new categories and attributes
content_types = ['Video', 'Image', 'Text']
child_feedback_options = ['Agree', 'Disagree']

# Existing categories and actions
categories = ['Adult', 'Violence', 'Hate_Speech', 'Discrimination', 'Online_Predators']
actions = ['Page_Viewed', 'Warning_Issued', 'Page_Blocked', 'Content_Filtered']

# Set the date range for the last 30 days
end_date = datetime.today()
start_date = end_date - timedelta(days=30)

# Generate browsing data with the new attributes without uniqueness constraint on user IDs
data = []

for _ in range(600):
    user_id = fake.random_int(min=1, max=600)  # Allow duplicate user IDs
    date = fake.date_between(start_date=start_date, end_date=end_date)
    time = fake.time()
    url = fake.uri()
    category = random.choice(categories)
    duration = random.randint(1, 60)  # Duration in minutes
    action = random.choice(actions)
    content_type = random.choice(content_types)
    child_feedback = random.choice(child_feedback_options)

    data.append([user_id, date, time, url, category, duration, action, content_type, child_feedback])

# Write the data to a CSV file
with open('browsing_history_enhanced.csv', 'w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    # Write the header
    writer.writerow(['user_id', 'date', 'time', 'URL', 'category', 
                     'duration_mins', 'action_taken', 'content_type', 'child_feedback'])
    # Write the data
    writer.writerows(data)

print('Generated 600 rows of enhanced browsing history data.')

