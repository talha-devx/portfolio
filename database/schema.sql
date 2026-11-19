-- =========================================================
--  database/schema.sql
--  Creates the portfolio database, its 2 tables and the
--  projects taken from Muhammad Talha's CV.
--
--  Safe to run more than once: nothing is dropped or duplicated.
--  Run with:  npm run db:setup   (or open it in MySQL Workbench)
-- =========================================================

CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ---------- 1. Portfolio projects (shown on the Projects page) ----------
CREATE TABLE IF NOT EXISTS projects (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(150)  NOT NULL,
  category    VARCHAR(80)   NOT NULL,
  description TEXT          NOT NULL,                -- one bullet point per line
  tech_stack  VARCHAR(255)  NOT NULL,                -- comma separated, e.g. "Python, PyTorch"
  project_url VARCHAR(255)  NULL,                    -- optional GitHub / demo link
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ---------- 2. Messages from the contact form ----------
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL,
  subject    VARCHAR(150)  NOT NULL,
  message    TEXT          NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ---------- Starter data: the 4 projects from my CV ----------
-- INSERT IGNORE skips rows whose id already exists, so re-running is safe.
-- Lines inside a description (\n) are shown as bullet points on the website.
-- To add a project later, copy one row, give it the next id (5, 6, ...) and run it.
INSERT IGNORE INTO projects (id, title, category, description, tech_stack) VALUES
(1,
 'Online Quiz System',
 'Web Application',
 'Created a web-based quiz application for attempting quizzes and viewing results.',
 'HTML, CSS, JavaScript'),

(2,
 'Movie Recommendation System',
 'Recommendation System',
 'Built a recommendation system that suggests movies to users based on their preferences.',
 'Python'),

(3,
 'MiniFS – Mini File System Simulator',
 'Operating Systems',
 'Developed a block-based file system inside a virtual disk with superblock, free-space bitmap, inode table, write-ahead journal and Unix-style CLI.\nImplemented indexed, linked and contiguous allocation, rwx permissions, crash recovery from the journal, fsck-style consistency checks and defragmentation.\nOperating Systems project built in a team of 3.',
 'Virtual Disk, Inode Table, Write-Ahead Journal, Unix-style CLI'),

(4,
 'SmartSort AI – Garbage Classification',
 'Deep Learning',
 'Built an image-based classifier that sorts waste into 13 recycling/disposal categories (plastic, glass, metal, paper, food, etc.).\nCleaned and de-duplicated the dataset, extracted EfficientNet-B0 embeddings, and compared CNN models against Decision Tree, SVM and Random Forest.\nDelivered a Streamlit demo app with evaluation reports, metrics and plots.',
 'Python, PyTorch, EfficientNet-B0, Scikit-learn, Streamlit');
