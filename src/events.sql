INSERT INTO events (
        id,
        location,
        date,
        activity,
        description,
        owner_id
    )
VALUES (
        lower(hex(randomblob(16))),
        'Harrison Park',
        '27-07-2023',
        'Walk and play',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        '814bba93d10553accb45c66dc4287d26'
    ),
    (
        lower(hex(randomblob(16))),
        'Lausriston Castle',
        '25-07-2023',
        'Walk',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        '3f751a16bc2c1f88c48e70c1ca3b93b3'
    ),
    (
        lower(hex(randomblob(16))),
        'Lausriston Castle',
        '26-07-2023',
        'Walk',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        '3f751a16bc2c1f88c48e70c1ca3b93b3'
    ),
    (
        lower(hex(randomblob(16))),
        'Inverleith Park',
        '30-07-2023',
        'Play',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        '05e416124c4ad2cb77ffbcc34dd8bb7a'
    ),
    (
        lower(hex(randomblob(16))),
        'Arthur Seat',
        '25-07-2023',
        'Hike',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'a2a0dddb4d852f49d9b60a62fb3a512a'
    );