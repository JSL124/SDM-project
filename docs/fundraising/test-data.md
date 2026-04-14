# Test Data: Create Fundraising Activity

## Purpose
Provide deterministic fundraising activity values for create fundraising activity testing.

## Sample Activities
```text
Activity A (valid activity for successful creation)
- title: Help the Community
- description: A fundraiser to support local shelters.
- targetAmount: 5000.00
- category: Community
- startDate: 2026-05-01
- endDate: 2026-06-01
- expected use: successful creation scenario

Activity B (invalid date range)
- title: Emergency Relief Fund
- description: Support for urgent response supplies.
- targetAmount: 2500.00
- category: Emergency
- startDate: 2026-06-15
- endDate: 2026-06-01
- expected use: end date validation failure

Activity C (invalid target amount)
- title: School Supply Drive
- description: Fund school materials for students.
- targetAmount: 0.00
- category: Education
- startDate: 2026-07-01
- endDate: 2026-08-01
- expected use: target amount validation failure
```

## Seed Data Template
```sql
insert into fundraising_activity (title, description, target_amount, category, start_date, end_date)
values
  ('Existing Community Drive', 'Current fundraiser for community support.', 1500.00, 'Community', '2026-04-01', '2026-05-01');
```

## Data Handling Rules
- Successful tests use positive target amounts and an end date after the start date.
- Validation failure tests use missing values, a zero or negative target amount, or an invalid date range.
- Seed data is optional for creation itself but helps verify persistence and later list retrieval behavior.
