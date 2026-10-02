

-- 1. ORGANIZATION TABLE

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- INSERT SAMPLE ORGANIZATIONS

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);



-- 2. SERVICE PROJECT TABLE

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,

    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);



-- INSERT SAMPLE SERVICE PROJECTS
INSERT INTO service_project (
    organization_id,
    title,
    description,
    location,
    date
)
VALUES

(
    1,
    'Park Cleanup',
    'Clean and improve a local community park.',
    'Central Community Park',
    '2026-10-15'
),
(
    1,
    'Playground Restoration',
    'Repair and improve playground equipment for local children.',
    'Riverside Park',
    '2026-10-20'
),
(
    1,
    'Community Garden Build',
    'Build raised garden beds for a neighborhood garden.',
    'Northside Community Center',
    '2026-10-25'
),
(
    1,
    'Home Repair Day',
    'Assist families with basic home repairs and maintenance.',
    'Westside Neighborhood',
    '2026-11-01'
),
(
    1,
    'School Improvement Project',
    'Help improve outdoor areas at a local school.',
    'Lincoln Elementary School',
    '2026-11-08'
),


(
    2,
    'Food Drive',
    'Collect and distribute food to families in need.',
    'Community Food Center',
    '2026-10-22'
),
(
    2,
    'Urban Garden Workshop',
    'Teach community members how to start an urban garden.',
    'GreenHarvest Garden',
    '2026-10-27'
),
(
    2,
    'Community Harvest Day',
    'Harvest fresh produce for local food programs.',
    'GreenHarvest Farm',
    '2026-11-03'
),
(
    2,
    'Neighborhood Tree Planting',
    'Plant trees and improve green spaces in the community.',
    'Eastside Neighborhood',
    '2026-11-10'
),
(
    2,
    'Food Sustainability Workshop',
    'Teach families about sustainable food practices.',
    'Community Learning Center',
    '2026-11-17'
),


(
    3,
    'Community Tutoring',
    'Tutor students in a variety of school subjects.',
    'Local Learning Center',
    '2026-10-29'
),
(
    3,
    'Senior Support Day',
    'Spend time assisting senior citizens with daily activities.',
    'Sunrise Senior Center',
    '2026-11-05'
),
(
    3,
    'Clothing Donation Drive',
    'Collect clothing for families in need.',
    'UnityServe Center',
    '2026-11-12'
),
(
    3,
    'Community Literacy Night',
    'Support children and adults through literacy activities.',
    'Downtown Library',
    '2026-11-19'
),
(
    3,
    'Holiday Care Packages',
    'Prepare care packages for families in the community.',
    'UnityServe Volunteer Center',
    '2026-11-26'
);



-- 3. CATEGORY TABLE

CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


-- INSERT SAMPLE CATEGORIES


INSERT INTO category (
    name
)
VALUES
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');


-- 4. PROJECT-CATEGORY JUNCTION TABLE

CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (
        project_id,
        category_id
    ),

    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);



-- ASSOCIATE PROJECTS WITH CATEGORIES


INSERT INTO project_category (
    project_id,
    category_id
)
VALUES
    -- BrightFuture Builders
    (1, 1),   -- Park Cleanup -> Environmental
    (2, 3),   -- Playground Restoration -> Community Service
    (3, 1),   -- Community Garden Build -> Environmental
    (4, 3),   -- Home Repair Day -> Community Service
    (5, 3),   -- School Improvement -> Community Service

    -- GreenHarvest Growers
    (6, 3),   -- Food Drive -> Community Service
    (7, 2),   -- Urban Garden Workshop -> Educational
    (8, 1),   -- Community Harvest Day -> Environmental
    (9, 1),   -- Tree Planting -> Environmental
    (10, 2),  -- Food Sustainability Workshop -> Educational

    -- UnityServe Volunteers
    (11, 2),  -- Community Tutoring -> Educational
    (12, 3),  -- Senior Support Day -> Community Service
    (13, 3),  -- Clothing Donation Drive -> Community Service
    (14, 2),  -- Community Literacy Night -> Educational
    (15, 3);  -- Holiday Care Packages -> Community Service