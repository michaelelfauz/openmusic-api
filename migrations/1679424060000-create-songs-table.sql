CREATE TABLE songs (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL,
    genre VARCHAR(100) NOT NULL,
    performer VARCHAR(255) NOT NULL,
    duration INTEGER,
    album_id VARCHAR(50) REFERENCES albums(id) ON DELETE SET NULL
);