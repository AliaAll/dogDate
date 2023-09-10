INSERT INTO dogProfile (id, name, breed, gender, age, avatar, owner_id)
VALUES (
    lower(hex(randomblob(16))),
    'Skye',
    'border collie',
    'm',
    '6',
    '',
    '3f751a16bc2c1f88c48e70c1ca3b93b3'
),
(
    lower(hex(randomblob(16))),
    'Izzy',
    'border collie',
    'f',
    '3',
    '',
    'a2a0dddb4d852f49d9b60a62fb3a512a'
),
(
    lower(hex(randomblob(16))),
    'Milo',
    'Beagle',
    'm',
    '10',
    '',
    '05e416124c4ad2cb77ffbcc34dd8bb7a'
),
(
    lower(hex(randomblob(16))),
    'Maya',
    'Beagle',
    'f',
    '7',
    '',
    '05e416124c4ad2cb77ffbcc34dd8bb7a'
),
(
    lower(hex(randomblob(16))), 
    'Poppy',
    'Dachshund',
    'f',
    '5',
    '',
    '814bba93d10553accb45c66dc4287d26'
);

