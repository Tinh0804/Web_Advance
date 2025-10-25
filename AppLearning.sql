USE master;
GO
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'AppLearning')
BEGIN
    ALTER DATABASE AppLearning SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE AppLearning;
END;
GO
CREATE DATABASE AppLearning;
GO
USE AppLearning;
GO

-- 1. LANGUAGES TABLE 
CREATE TABLE LANGUAGES (
    languageId int PRIMARY KEY IDENTITY(1,1),
    languageName VARCHAR(50) NOT NULL,
    languageCode VARCHAR(5) UNIQUE NOT NULL,
    flagIcon VARCHAR(255),
    isSupported BIT DEFAULT 1
);
INSERT INTO LANGUAGES (languageName, languageCode, flagIcon, isSupported)
VALUES 
('English', 'EN', '/flags/en.png', 1),
('Vietnamese', 'VI', '/flags/vi.png', 1),
('Japanese', 'JA', '/flags/ja.png', 1),
('Korean', 'KO', '/flags/ko.png', 1),
('Chinese', 'ZH', '/flags/zh.png', 1),
('Spanish', 'ES', '/flags/es.png', 1),
('French', 'FR', '/flags/fr.png', 1),
('German', 'DE', '/flags/de.png', 1);

-- 2. USERS TABLE
CREATE TABLE USERS (
    userId int PRIMARY KEY IDENTITY(1,1),
    phoneNumber VARCHAR(15) UNIQUE ,
    fullName VARCHAR(100),
    dateOfBirth DATE,
    nativeLanguageId int,
    totalExperience INT DEFAULT 0,
    currentStreak INT DEFAULT 0,
    longestStreak INT DEFAULT 0,
    hearts INT DEFAULT 5,
    subscriptionType VARCHAR(10) DEFAULT 'free' CHECK (subscriptionType IN ('free', 'premium')),
    FOREIGN KEY (nativeLanguageId) REFERENCES LANGUAGES(languageId)
);

-- 3. COURSES TABLE
CREATE TABLE COURSES (
    courseId int PRIMARY KEY IDENTITY(1,1),
    courseName VARCHAR(100) NOT NULL,
    fromLanguageId int NOT NULL,
    toLanguageId int NOT NULL,
    difficultyLevel VARCHAR(20) DEFAULT 'beginner' CHECK (difficultyLevel IN ('beginner', 'elementary', 'intermediate', 'advanced')),
    courseIcon VARCHAR(255),
    FOREIGN KEY (fromLanguageId) REFERENCES LANGUAGES(languageId),
    FOREIGN KEY (toLanguageId) REFERENCES LANGUAGES(languageId)
);

-- 4. UNITS TABLE
CREATE TABLE UNITS (
    unitId int PRIMARY KEY IDENTITY(1,1),
    courseId int NOT NULL,
    unitName VARCHAR(100) NOT NULL,
    orderIndex INT,
    unlockRequired BIT DEFAULT 0,
    FOREIGN KEY (courseId) REFERENCES COURSES(courseId)
);

-- 5. LESSONS TABLE
CREATE TABLE LESSONS (
    lessonId int PRIMARY KEY IDENTITY(1,1),
    unitId int NOT NULL,
    lessonName VARCHAR(100) NOT NULL,
    orderIndex INT,
    experienceReward INT DEFAULT 10,
    unlockRequired BIT DEFAULT 0,
    FOREIGN KEY (unitId) REFERENCES UNITS(unitId)
);

-- 6. EXERCISES TABLE
CREATE TABLE EXERCISES (
    exerciseId int PRIMARY KEY IDENTITY(1,1),
    lessonId int NOT NULL,
    exerciseType VARCHAR(20) CHECK (exerciseType IN ('multiple_choice', 'listen', 'match_pairs', 'word_order')),
    question NVARCHAR(MAX) NOT NULL,
    correctAnswer NVARCHAR(MAX) NOT NULL,
    options NVARCHAR(MAX),
    audioFile VARCHAR(255),
    experienceReward INT DEFAULT 10,
    FOREIGN KEY (lessonId) REFERENCES LESSONS(lessonId)
);

-- 7. WORDS TABLE
CREATE TABLE WORDS (
    wordId int PRIMARY KEY IDENTITY(1,1),
    languageId int NOT NULL,
    word NVARCHAR(MAX) NOT NULL,
    translation NVARCHAR(MAX) NOT NULL,
    pronunciation VARCHAR(255),
    wordType VARCHAR(20) CHECK (wordType IN ('noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction')),
    audioFile VARCHAR(255),
    exampleSentence NVARCHAR(MAX),
    imageUrl VARCHAR(255),
    FOREIGN KEY (languageId) REFERENCES LANGUAGES(languageId)
);

-- 8. LESSON_WORDS TABLE
CREATE TABLE LESSON_WORDS (
    lessonWordId int PRIMARY KEY IDENTITY(1,1),
    lessonId int NOT NULL,
    wordId int NOT NULL,
    FOREIGN KEY (lessonId) REFERENCES LESSONS(lessonId),
    FOREIGN KEY (wordId) REFERENCES WORDS(wordId)
);

-- 9. USER_COURSES TABLE
CREATE TABLE USER_COURSES (
    userCourseId int PRIMARY KEY IDENTITY(1,1),
    userId int NOT NULL,
    courseId int NOT NULL,
    currentUnitId int,
    currentLessonId int,
    totalExperienceEarned INT DEFAULT 0,
    isCompleted BIT DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES USERS(userId),
    FOREIGN KEY (courseId) REFERENCES COURSES(courseId),
    FOREIGN KEY (currentUnitId) REFERENCES UNITS(unitId),
    FOREIGN KEY (currentLessonId) REFERENCES LESSONS(lessonId)
);

-- 10. ACHIEVEMENTS TABLE
CREATE TABLE ACHIEVEMENTS (
    achievementId int PRIMARY KEY IDENTITY(1,1),
    achievementName VARCHAR(100) NOT NULL,
    achievementType VARCHAR(20) CHECK (achievementType IN ('streak', 'experience', 'lessons', 'perfect', 'speed', 'consistency')),
    requiredValue INT NOT NULL,
    badgeIcon VARCHAR(255),
    experienceReward INT DEFAULT 0
);

-- 11. USER_ACHIEVEMENTS TABLE
CREATE TABLE USER_ACHIEVEMENTS (
    userAchievementId int PRIMARY KEY IDENTITY(1,1),
    userId int NOT NULL,
    achievementId int NOT NULL,
    dateEarned DATETIME,
    FOREIGN KEY (userId) REFERENCES USERS(userId),
    FOREIGN KEY (achievementId) REFERENCES ACHIEVEMENTS(achievementId)
);

-- 12. GOAL TABLE
CREATE TABLE GOAL (
    goalId int PRIMARY KEY IDENTITY(1,1),
    userId int NOT NULL,
    targetValue INT NOT NULL,
    currentValue INT DEFAULT 0,
    resetDate DATE,
    FOREIGN KEY (userId) REFERENCES USERS(userId)
);

GO

select * from Users
select * from AspNetRoleClaims
select * from AspNetRoles
select * from AspNetUserClaims
select * from AspNetUserRoles
select * from AspNetUserLogins
select * from AspNetUsers

select * from AspNetUserTokens
select * from LANGUAGES
select * from refreshtokens

EXEC sp_help 'AspNetUsers'