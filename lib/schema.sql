-- Drop tables if they exist
DROP TABLE IF EXISTS match_participants CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;

-- Create players table
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    nickname VARCHAR(100),
    avatar_url TEXT NOT NULL,
    color VARCHAR(30) NOT NULL DEFAULT '#64748B',
    streak INT DEFAULT 0,
    total_victories_all_time INT DEFAULT 0
);

-- Create matches table
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    game_name VARCHAR(100) NOT NULL,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration_minutes INT DEFAULT 60,
    notes TEXT,
    league VARCHAR(50) DEFAULT 'Standard'
);

-- Create match_participants table
CREATE TABLE match_participants (
    match_id INT REFERENCES matches(id) ON DELETE CASCADE,
    player_id INT REFERENCES players(id) ON DELETE CASCADE,
    score INT,
    is_winner BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (match_id, player_id)
);

-- Seed players
INSERT INTO players (name, nickname, avatar_url, streak, total_victories_all_time) VALUES
('Alex Thorne', 'Table Leader', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsOU_lHyClZDF6ik6dEGuVpHHLSVpYCPOfPKW9MrnBaeMkQLhn0U4L7dSbCnKA4wR5Z69I0Zy4Qpvhu41x9BMeqMewN0Va8DdxBGR2fo3IeV6LzJ7Rg6P6JIfkNrILzgF6UEtju3YrOIXeiJDfJqUAz2VhWMO3fa98lGBU07Aj8OWoVVNfmA995VJQSYBDg02NjlciA8HR4UhcqCJ0QBjl9X2bsWrRixIYsVnodyHilLckO2pjwYf2j-hPXHIoVDsr0lQlXhwtEa0', 5, 42),
('Jordan Rivers', 'The Challenger', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQOM7tGsSDFPUOUelro2PBhldNFA0zrHrmI2G5nIC2Vv1SQBCVHCq_w6BZ-5KU1hWlfhYsiN-qQM62wvOitYHikpycQeNLNSFByAYWRT3i5lqh8iDvLd0Y0VyF_c3eOlqJEJR7qDvqBBucRCIh_SJ5PMV_JAo7EyLc23GdJQ835jYeUJV_z0lmVSwMBMt2H5LiCTs9828nx_MQFtEv_cgUwKsIuFua5Rmf72a-NGgeFqGW4Bx7zil1PpCtVw8itnJUJK2tEqCvC88', 2, 38),
('Casey Morgan', 'The Tactician', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfFFkZmRDwb78MJp7WrO7aTytCUAKf7tp4YLa03arbfDUmF22HwMApxU0SkoDnTr_GW6JYaiPz39BYI-j1ifSAe_yu5Op4QZ3ppzYFpTCsN2TxK1v6bY77-gR4RfFc_Dc9H4mU7dvnjzttVqhMEoJVU62fEL13rGTQv1n6qTZctTXmutLhSFaUKGJMkIHRG1uAbn9zJgv7rgUpPRRBeKBYLzKhoheBPxhxzTS6TgUOHRCWDbROTwaxo7VG7OxestzONgUlX2wuFVA', 3, 35),
('Riley Smith', 'Scythe Pro', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA27_R3uwyUUxxVIz_Z98ur_7PQP8lNuBIfi6YxLkKjw-hCay5VFc1gR1yENmDa4wf2UFfx-uxBmqufD6X3XJBFTuytyqyXTOEH7X2iTP_vXtRv1SGSU8RyDThkrbu_5tU26yDmFoFaGjzCeF39zD8cqj08k083zUk1CEQE9T6BK_eRehl2zzjKRN-TcGjJEfAvVK2vHuAorjfPxFxx3bWcdGfITDGrtHOMNZeQPJfDv62TiVcfkqJXvYRkHrc6snI5oK6DyJtcgmY', 0, 29),
('Taylor Vance', 'Rookie', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS8_Ho7BSuUvfTEBrVfGyS_HdV0gffEOvKdv-NapieIO6fkb80PLRdrius94WAQr9JK21D4A69Kk6SY8NMBzhZQy9s1ui7t2k5VM9mZRZFtSJAb9HI0ZnHTL0u1W1UtrlWlhAJAeyNUmMPHHzp9Dlug0Td770GQsaC6rpZT2nRB6Jsq7m_7XB12wzCaaNd6s6XH_mfZ3ZeL9ycTT6DJq6R02a5a_CZxArL-e-zSmWamuE16Y6gyqIENfnJhyt13wUfRq4MEDku7jc', 0, 24),
('Marcus Chen', 'The General', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAt42EnGoqdBpenMv3v6ydGM2oGak9_MzIz0Mu2GdBfZj5Kq_r0f9u6fiaJU-eVV-NkdEs36pph15FbWqPMpaeAELg7Va6iSxRoe6BeO52_GRsji6KFLuvqTOUqAbOaxeDkCX7UJy9pY54oMdeYTKRUrJvg9dzfzgK6tcyH0gtv6ahN3Hyfd4wVxPblBSymma4AQx3Q73kxFqleVaTsftf0G6As_dR4Nbd0M4Yi3Ct26IBk0CvOIvKzwqM9Y1TpOvHALDKCgXmb5fU', 5, 142),
('Alex Rivera', 'Casual Gamer', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDN27qUt_KpgB1rfaYcUZr73F_76hXFuLvypM488UMCcaiZjETn4gWNVbqgygK9w8XqHkuh027ItexoDShzPMiGj-9EwXYq3cNt2VxINxEItmlwa1PM7HJFqA8txvX-1unmHu7z1l8zQJYRFioorhD9_AtDGyTErfYHgE7G847f8rclJOtUfrXqQbdFF4pTb3aIz3gndr1QYbzNXKYXuFM5vLUoeet59H-16KTnjC6dB1YNyblEK_3y_KRs1z030iA6g-tHfyWdkMo', 1, 15),
('Sarah Chen', 'Vibe Master', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHWuNGmIjuGdL5CTMCRlYtU6eKpF_wJ0Y_GI_DZMPdjDUUjpH0daUjo2Z9vakfEm4SPZnI-Tn6Obm3tahsEECV0JyYjsYqhaG3PbipSo9-df50jLh2Up1HhlydTjPufY4T4Y9tYPZTlg40pGTXy5RP6iI8VbjXK9PG0ML3YouD6R0mVMIg5X5szo_PCty98DOeA2Zv6hc4EGU8gumeCRMe3aOr_UnjHYXD7-m1bQ2aEbSiZt1GBpskhKFsIyMJnnY6ittNL9GjYLw', 0, 8),
('Marcus Todd', 'Card Sharp', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvBeFu6-rOqMj9c3T13cWn9uLuHpKcHSPYZgtODE3ug2bx3n-iE4Doyc0JidWymZqIfc-5XAvmkwgt5r2p3f2ArONYqY_-IjW2DbIHRxxqy6CmmuexfraQxqDXs0-gepBJW3dr7_rT9lAay1FQWEb6_4DHojbPAcr0z6nG_KxrStJlMjQZdSfs69t9fKS1C7anoM5-ACmk1Yy_2JHstMEUNduZeTxzuQlDMDoCdWm19c65cgObkFogmq60ojkUfwcpoA8-vlqQ_fc', 0, 11),
('Elena Vance', 'Natural talent', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIAPEMIM2VjVX1CHHvktuCayTfYBLrytqlaHFC7aRXBM4FNAC5ca2PAiGEN7ygIeoDODY0FWhLghVGQbZupvA_sgkJMq7nqFsc6YOCgxacjv-M_SULki-uaEa52mY6ZvnchwG85exxCIleo6Ndjip0lO5qggBZ4lrs7Fm2Y1gfcYwfGR0kp9dTun52MY4CvqdKQCU7aV9_hELYVpDbW9kBlogadqHhIFshAF3s35MNbldrEZUFXvuUn_wCmt2RT6NRRGh9jdjECD0', 1, 18),
('John Doe', 'Unknown Factor', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTjxedNc_6V-UTCQByaPMlRypjtvrIIfBsMNqsUPtFAGOCosCEqq1DRknfLkypqBnoxDFGJZfJ6U4_-PXx5J9zD3CiYd6XqOmhM_1iGARLGfU3AUCevLLCZvJe5n691ljdIXnekfhVEYZfOTBm4aaScnf0yvV3P7-hKDuZ8IW-zizavOoxlSes9YCfcedadTmz5qELWkDeSEIuA1JtoAI5RNXOFWs9qZOsTN22R4GCzRt-1GY1z-6SXz1_GgQyvC9M7puK7XBqadg', 1, 10);

-- Seed matches & participants to build mock leaderboard
-- Match 1: Terraforming Mars
INSERT INTO matches (id, game_name, notes, league, duration_minutes) VALUES
(1, 'Terraforming Mars', 'Epic comeback in the final round!', 'Pro League', 150);

INSERT INTO match_participants (match_id, player_id, score, is_winner) VALUES
(1, 6, 84, TRUE), -- Marcus Chen won
(1, 8, 72, FALSE), -- Sarah Chen
(1, 9, 68, FALSE); -- Marcus Todd

-- Match 2: Wingspan
INSERT INTO matches (id, game_name, notes, league, duration_minutes) VALUES
(2, 'Wingspan', 'Elena dominated with forest birds', 'Standard', 72);

INSERT INTO match_participants (match_id, player_id, score, is_winner) VALUES
(2, 10, 94, TRUE), -- Elena Vance won
(2, 7, 81, FALSE); -- Alex Rivera

-- Match 3: Catan
INSERT INTO matches (id, game_name, notes, league, duration_minutes) VALUES
(3, 'Catan', 'Longest road secured the victory!', 'Standard', 45);

INSERT INTO match_participants (match_id, player_id, score, is_winner) VALUES
(3, 11, 10, TRUE), -- John Doe won
(3, 7, 8, FALSE), -- Alex Rivera
(3, 9, 7, FALSE); -- Marcus Todd

-- Seed historical victories for Alex Thorne, Jordan Rivers, Casey Morgan alongside logged match wins
INSERT INTO matches (id, game_name, notes, league, duration_minutes) VALUES
(4, 'Scythe', 'High tier gameplay', 'Standard', 120),
(5, 'Root', 'Woodland alliance wins', 'Standard', 90),
(6, 'Azul', 'Tile matching champion', 'Standard', 40);

INSERT INTO match_participants (match_id, player_id, score, is_winner) VALUES
(4, 1, 75, TRUE), -- Alex Thorne
(4, 2, 64, FALSE),
(4, 3, 50, FALSE),
(5, 2, 30, TRUE), -- Jordan Rivers
(5, 3, 28, FALSE),
(5, 4, 15, FALSE),
(6, 3, 42, TRUE), -- Casey Morgan
(6, 1, 38, FALSE),
(6, 5, 25, FALSE);

-- Ensure auto-increment starts after seeded matches
SELECT setval('matches_id_seq', (SELECT MAX(id) FROM matches));
