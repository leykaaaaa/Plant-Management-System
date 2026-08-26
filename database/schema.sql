CREATE DATABASE build_and_bloom;

USE build_and_bloom;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crops (
    crop_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_name VARCHAR(100) NOT NULL,
    description TEXT,
    growing_period VARCHAR(100),
    harvest_period VARCHAR(100)
);

CREATE TABLE crop_requirements (
    requirement_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    soil_type VARCHAR(100),
    water_requirement VARCHAR(50),
    sunlight_requirement VARCHAR(50),
    min_temperature DECIMAL(5,2),
    max_temperature DECIMAL(5,2),
    environment VARCHAR(100),

    FOREIGN KEY (crop_id)
        REFERENCES crops(crop_id)
        ON DELETE CASCADE
);

CREATE TABLE planting_calendar (
    calendar_id INT AUTO_INCREMENT PRIMARY KEY,
    crop_id INT NOT NULL,
    location VARCHAR(100) NOT NULL,
    planting_month VARCHAR(50),
    season VARCHAR(100),

    FOREIGN KEY (crop_id)
        REFERENCES crops(crop_id)
        ON DELETE CASCADE
);

CREATE TABLE recommendations (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    crop_id INT NOT NULL,
    location VARCHAR(100),
    compatibility_score DECIMAL(5,2),
    result VARCHAR(50),
    recommendation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL,

    FOREIGN KEY (crop_id)
        REFERENCES crops(crop_id)
        ON DELETE CASCADE
);

CREATE TABLE weather_records (
    weather_id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(100) NOT NULL,
    temperature DECIMAL(5,2),
    humidity DECIMAL(5,2),
    rainfall DECIMAL(6,2),
    weather_condition VARCHAR(100),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO crops
(crop_name, description, growing_period, harvest_period)
VALUES
(
    'Rice',
    'A major agricultural crop commonly grown in Pangasinan.',
    '3-4 months',
    '3-4 months'
),
(
    'Corn',
    'A major crop used for food, feed, and other agricultural purposes.',
    '3-4 months',
    '3-4 months'
),
(
    'Tomato',
    'A vegetable crop commonly grown in home gardens and farms.',
    '2-3 months',
    '2-3 months'
),
(
    'Onion',
    'A bulb crop commonly cultivated in agricultural areas.',
    '3-4 months',
    '3-4 months'
),
(
    'Camote',
    'A root crop that can grow under suitable soil and environmental conditions.',
    '3-5 months',
    '3-5 months'
),
(
    'Peanut',
    'A legume crop suitable for appropriate soil and growing conditions.',
    '3-4 months',
    '3-4 months'
);

USE build_and_bloom;

INSERT INTO crop_requirements
(crop_id, soil_type, water_requirement, sunlight_requirement,
 min_temperature, max_temperature, environment)
VALUES

-- Rice
(
    1,
    'clay,loamy',
    'high',
    'high',
    20,
    35,
    'outdoor'
),

-- Corn
(
    2,
    'loamy,sandy',
    'medium',
    'high',
    18,
    35,
    'outdoor'
),

-- Tomato
(
    3,
    'loamy,silty',
    'medium',
    'high',
    18,
    30,
    'outdoor,greenhouse'
),

-- Onion
(
    4,
    'loamy,sandy',
    'medium',
    'high',
    13,
    30,
    'outdoor'
),

-- Camote
(
    5,
    'sandy,loamy',
    'low,medium',
    'high',
    20,
    35,
    'outdoor'
),

-- Peanut
(
    6,
    'sandy,loamy',
    'medium',
    'high',
    20,
    35,
    'outdoor'
);