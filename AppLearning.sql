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
    avatar VARCHAR(200),
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
    orderIndex INT,
    audioFile VARCHAR(255),
    experienceReward INT DEFAULT 10,
    FOREIGN KEY (lessonId) REFERENCES LESSONS(lessonId)
);

-- 7. WORDS TABLE
CREATE TABLE WORDS (
    wordId int PRIMARY KEY IDENTITY(1,1),
    languageId int NOT NULL,
    lessonId int not null,
    word NVARCHAR(MAX) NOT NULL,
    translation NVARCHAR(MAX) NOT NULL,
    pronunciation NVARCHAR(255),
    wordType VARCHAR(20) CHECK (wordType IN ('noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction')),
    audioFile VARCHAR(255),
    exampleSentence NVARCHAR(MAX),
    imageUrl VARCHAR(255),
    FOREIGN KEY (languageId) REFERENCES LANGUAGES(languageId),
    FOREIGN KEY (lessonId) REFERENCES LESSONS(lessonId)
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



INSERT INTO USERS (phoneNumber, fullName, dateOfBirth, nativeLanguageId, avatar, totalExperience, currentStreak, longestStreak, hearts, subscriptionType)
VALUES
('0987654321', 'Nguyen Van A', '2000-05-12', 2, '/avatars/user1.png', 150, 5, 10, 5, 'free'),
('0978123456', 'Tran Thi B', '1998-08-22', 1, '/avatars/user2.png', 500, 10, 15, 4, 'premium'),
('0911223344', 'Le Minh C', '2001-01-30', 1, '/avatars/user3.png', 50, 2, 4, 5, 'free');

INSERT INTO COURSES (courseName, fromLanguageId, toLanguageId, difficultyLevel, courseIcon)
VALUES
('English for Vietnamese', 2, 1, 'beginner', '/courses/en_vi.png'),
('Vietnamese for English Speakers', 1, 2, 'beginner', '/courses/vi_en.png'),
('Japanese for English Speakers', 1, 3, 'elementary', '/courses/en_ja.png'),
('Korean for English Speakers', 1, 4, 'elementary', '/courses/en_ko.png');

INSERT INTO UNITS (courseId, unitName, orderIndex, unlockRequired)
VALUES
(1, 'Basics 1', 1, 0),
(1, 'Basics 2', 2, 1),
(2, 'Chào hỏi cơ bản', 1, 0),
(3, 'Greetings', 1, 0),
(4, 'Introduction', 1, 0);

INSERT INTO LESSONS (unitId, lessonName, orderIndex, experienceReward, unlockRequired)
VALUES
(1, 'Hello and Goodbye', 1, 10, 0),
(1, 'Numbers', 2, 10, 1),
(2, 'Family', 1, 15, 0),
(3, 'Xin chào', 1, 10, 0),
(4, 'Konnichiwa', 1, 10, 0);

INSERT INTO EXERCISES (lessonId, exerciseType, question, correctAnswer, options, audioFile, experienceReward)
VALUES
(1, 'multiple_choice', N'What does "Hello" mean in Vietnamese?', N'Xin chào', N'["Tạm biệt","Xin chào","Cảm ơn","Không"]', '/audio/hello.mp3', 10),
(1, 'word_order', N'Arrange words to form: "Tôi là học sinh"', N'Tôi là học sinh', N'["học","Tôi","sinh","là"]', NULL, 10),
(2, 'multiple_choice', N'Number 5 in English?', N'Five', N'["Four","Five","Six","Seven"]', '/audio/five.mp3', 10),
(4, 'multiple_choice', N'"Hello" tiếng Việt là gì?', N'Xin chào', N'["Tạm biệt","Xin chào","Cảm ơn","Không"]', NULL, 10);

INSERT INTO WORDS (languageId, word, translation, pronunciation, wordType, audioFile, exampleSentence, imageUrl)
VALUES
(1, N'Hello', N'Xin chào', '/audio/hello.mp3', 'noun', '/audio/hello.mp3', N'Hello, how are you?', '/images/hello.png'),
(1, N'Cat', N'Mèo', '/audio/cat.mp3', 'noun', '/audio/cat.mp3', N'The cat is sleeping.', '/images/cat.png'),
(2, N'Mèo', N'Cat', '/audio/meo.mp3', 'noun', '/audio/meo.mp3', N'Mèo đang ngủ.', '/images/meo.png'),
(3, N'こんにちは', N'Xin chào', '/audio/konnichiwa.mp3', 'noun', '/audio/konnichiwa.mp3', N'こんにちは！元気ですか。', '/images/ja_hello.png');

INSERT INTO USER_COURSES (userId, courseId, currentUnitId, currentLessonId, totalExperienceEarned, isCompleted)
VALUES
(1, 1, 1, 1, 50, 0),
(2, 3, 4, 5, 120, 0),
(3, 2, 3, 4, 30, 0);

INSERT INTO ACHIEVEMENTS (achievementName, achievementType, requiredValue, badgeIcon, experienceReward)
VALUES
('7-Day Streak', 'streak', 7, '/badges/streak7.png', 50),
('100 XP Earned', 'experience', 100, '/badges/xp100.png', 50),
('10 Lessons Completed', 'lessons', 10, '/badges/lesson10.png', 100),
('Perfect Lesson', 'perfect', 1, '/badges/perfect.png', 30);
INSERT INTO USER_ACHIEVEMENTS (userId, achievementId, dateEarned)
VALUES
(1, 1, GETDATE()),
(2, 2, GETDATE()),
(2, 3, GETDATE());

INSERT INTO GOALS (userId, targetValue, currentValue, resetDate)
VALUES
(1, 50, 30, '2025-10-31'),
(2, 100, 80, '2025-10-31'),
(3, 20, 10, '2025-10-31');

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
select * from LESSONS
select * from refreshtokens
select * from Permissions
select * from Goals

EXEC sp_help 'AspNetUsers'