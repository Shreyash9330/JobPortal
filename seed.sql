-- JobPortal demo data (safe to run more than once)
-- Demo password for all 3 accounts: Demo@1234
-- Run:  see README ("Load demo data")

-- 1) Users: admin, employer, jobseeker
INSERT IGNORE INTO user (created_at, updated_at, name, email, password, role, enabled) VALUES
(NOW(6), NOW(6), 'Demo Admin',    'admin@jobportal.com',    '$2a$10$8SS1iwlpT/w6b7ClzKfSx.IYrC05hhsrYHVYGuMs1vkL8zmO/rIQa', 'ADMIN',     1),
(NOW(6), NOW(6), 'Demo HR',       'employer@jobportal.com', '$2a$10$8SS1iwlpT/w6b7ClzKfSx.IYrC05hhsrYHVYGuMs1vkL8zmO/rIQa', 'EMPLOYER',   1),
(NOW(6), NOW(6), 'Demo Seeker',   'seeker@jobportal.com',   '$2a$10$8SS1iwlpT/w6b7ClzKfSx.IYrC05hhsrYHVYGuMs1vkL8zmO/rIQa', 'JOBSEEKER', 1);

-- 2) Employer profile for the demo employer
INSERT INTO employer_profile
  (created_at, updated_at, company_name, company_size, description, hr_name, industry, logo, phone, website, user_id)
SELECT NOW(6), NOW(6), 'TechNova Solutions', '51-200',
       'Product engineering company building SaaS tools for logistics and fintech teams.',
       'Demo HR', 'Information Technology', NULL, '9876543210', 'https://example.com', u.id
FROM user u
WHERE u.email = 'employer@jobportal.com'
  AND NOT EXISTS (SELECT 1 FROM employer_profile e WHERE e.user_id = u.id);

-- 3) Jobs posted by the demo employer
INSERT INTO job
  (created_at, updated_at, company, description, employer_email, experience, job_type, location, salary, skills, status, title)
SELECT NOW(6), NOW(6), 'TechNova Solutions', s.description, 'employer@jobportal.com',
       s.experience, s.job_type, s.location, s.salary, s.skills, 'ACTIVE', s.title
FROM (
  SELECT 'Java Backend Developer' AS title, 'Pune' AS location, 'FULL_TIME' AS job_type,
         '0-2 years' AS experience, '4-6 LPA' AS salary,
         'Java, Spring Boot, MySQL, REST APIs' AS skills,
         'Build and maintain REST APIs with Spring Boot and MySQL. Write unit tests and work with the frontend team.' AS description
  UNION ALL SELECT 'React Frontend Developer', 'Bangalore', 'FULL_TIME', '1-3 years', '5-8 LPA',
         'React, JavaScript, HTML, CSS, Axios',
         'Create responsive user interfaces in React, integrate REST APIs and improve page performance.'
  UNION ALL SELECT 'Java Full Stack Intern', 'Pune', 'INTERNSHIP', 'Fresher', '15-20 K per month',
         'Java, Spring Boot, React, SQL',
         '6-month paid internship. Work on real features across backend and frontend with a mentor.'
  UNION ALL SELECT 'Software Engineer (Remote)', 'Remote', 'REMOTE', '2-4 years', '8-12 LPA',
         'Java, Spring Security, Docker, AWS',
         'Remote-first role working on secure microservices, Docker based deployments and CI pipelines.'
  UNION ALL SELECT 'QA Automation Engineer', 'Hyderabad', 'FULL_TIME', '1-3 years', '4-7 LPA',
         'Selenium, JUnit, Postman, SQL',
         'Design and run automated test suites for web and API features. Report and track defects.'
  UNION ALL SELECT 'Data Analyst', 'Mumbai', 'FULL_TIME', '0-2 years', '4-6 LPA',
         'SQL, Excel, Power BI, Python',
         'Analyse product and hiring data, build dashboards and share weekly insights with managers.'
  UNION ALL SELECT 'UI/UX Designer', 'Pune', 'PART_TIME', '1-2 years', '25-35 K per month',
         'Figma, Wireframing, Prototyping',
         'Part-time designer for web dashboards. Create wireframes, prototypes and design system components.'
  UNION ALL SELECT 'DevOps Engineer', 'Bangalore', 'CONTRACT', '3-5 years', '12-18 LPA',
         'Docker, GitHub Actions, Linux, AWS',
         '12-month contract to set up CI/CD, containerise services and monitor application health.'
) s
WHERE NOT EXISTS (
  SELECT 1 FROM job j
  WHERE j.title = s.title AND j.employer_email = 'employer@jobportal.com'
);

-- 4) Quick check
SELECT email, role FROM user ORDER BY id;
SELECT id, title, location, job_type, status FROM job ORDER BY id;
-- numeric salaries (annual, INR) so the UI formats them correctly
UPDATE job SET salary='500000' WHERE title='Java Backend Developer' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='650000' WHERE title='React Frontend Developer' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='180000' WHERE title='Java Full Stack Intern' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='800000' WHERE title='Software Engineer (Remote)' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='600000' WHERE title='QA Automation Engineer' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='550000' WHERE title='Data Analyst' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='300000' WHERE title='UI/UX Designer' AND employer_email='employer@jobportal.com';
UPDATE job SET salary='900000' WHERE title='DevOps Engineer' AND employer_email='employer@jobportal.com';
