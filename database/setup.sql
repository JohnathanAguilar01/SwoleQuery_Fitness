-- file to set up sql database
CREATE DATABASE IF NOT EXISTS SwoleQuery_Fitness;

USE SwoleQuery_Fitness;


CREATE TABLE IF NOT EXISTS users(
  user_id int auto_increment primary key,
  first_name varchar(256) not null,
  last_name varchar(256) not null,
  username varchar(265) unique not null,
  email varchar(256) unique not null,
  password varchar(256) not null,
  height decimal(5,1),
  weight decimal(5,1),
  created_at timestamp
);

CREATE TABLE IF NOT EXISTS workouts(
  workout_id int auto_increment primary key,
  user_id int,
  workout_date datetime,
  notes varchar(256),

  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS exercises(
  exercise_id int auto_increment primary key,
  user_id int,
  workout_id int,
  intensity DECIMAL(5,2),
  exercise_type varchar(20) CHECK ( exercise_type IN ('cardio', 'strength training')),
  calories_burned INT,

  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (workout_id) REFERENCES workouts(workout_id)
);

CREATE TABLE calisthenics_exercises (
    exercise_id INT PRIMARY KEY,
    exercise_time int,  -- Distance in kilometers or miles
    
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
);

CREATE TABLE weight_exercises (
    exercise_id INT PRIMARY KEY,
    weight decimal(5,1),
    sets INT,
    reps INT,

    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS meals(
  meal_id int auto_increment PRIMARY KEY,
  user_id int,
  meal_date date,
  calories int,
  protein decimal(6,2),
  carbs decimal(6,2),
  fats decimal(6,2),
  notes varchar(256),

  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS food_items(
  food_id INT PRIMARY KEY AUTO_INCREMENT,
  meal_id INT,  -- Links to the meal table
  food_name VARCHAR(100) NOT NULL,
  quantity DECIMAL(6,2) NOT NULL,  -- Amount of food consumed (e.g., 100 grams)
  unit VARCHAR(20) NOT NULL,  -- Unit of measurement (e.g., grams, oz, cup)
  calories INT NOT NULL,  -- Calories in the given quantity
  protein DECIMAL(6,2),  -- Protein in grams
  carbs DECIMAL(6,2),  -- Carbohydrates in grams
  fats DECIMAL(6,2),  -- Fats in grams
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- When the entry was recorded

  FOREIGN KEY (meal_id) REFERENCES meals(meal_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- When the measurement was recorded
    weight DECIMAL(5,2) NOT NULL, -- User's weight
    body_fat_percentage DECIMAL(5,2) NULL, -- Optional: Body fat percentage
    muscle_mass DECIMAL(5,2) NULL, -- Optional: Muscle mass in kg or lbs

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
