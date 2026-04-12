import bcrypt from 'bcrypt';

const passwords = [
  { label: 'Account A (active.fundraiser@example.com)', raw: 'Fundraiser123!' },
  { label: 'Account B (wrongpass.fundraiser@example.com)', raw: 'CorrectPass123!' },
  { label: 'Account C (disabled.fundraiser@example.com)', raw: 'Disabled123!' },
];

async function main() {
  for (const { label, raw } of passwords) {
    const hash = await bcrypt.hash(raw, 10);
    console.log(`-- ${label}`);
    console.log(`-- raw: ${raw}`);
    console.log(`'${hash}'`);
    console.log();
  }

  console.log('-- Copy the hashes above into 002-seed-test-data.sql');
}

main();
