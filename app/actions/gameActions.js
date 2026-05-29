'use server';

import pool, { query } from '@/lib/db';
import { initDatabase } from '@/lib/initDb';

// Utility to ensure database is set up before any action runs
async function ensureDb() {
  await initDatabase();
}

/**
 * Fetches all players ranked by total wins (season wins from matches + all-time wins).
 */
export async function getLeaderboard() {
  await ensureDb();
  try {
    const sql = `
      SELECT 
        p.id, 
        p.name, 
        p.nickname, 
        p.avatar_url, 
        p.streak,
        p.total_victories_all_time,
        COALESCE(COUNT(CASE WHEN mp.is_winner = TRUE THEN 1 END), 0) AS season_wins,
        (p.total_victories_all_time + COALESCE(COUNT(CASE WHEN mp.is_winner = TRUE THEN 1 END), 0)) AS wins,
        COALESCE(
          (SELECT game_name FROM matches m 
           JOIN match_participants mp2 ON m.id = mp2.match_id 
           WHERE mp2.player_id = p.id AND mp2.is_winner = TRUE 
           ORDER BY m.played_at DESC LIMIT 1),
          'N/A'
        ) AS last_win_game
      FROM players p
      LEFT JOIN match_participants mp ON p.id = mp.player_id
      GROUP BY p.id
      ORDER BY wins DESC, p.name ASC;
    `;
    const res = await query(sql);
    return res.rows;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

/**
 * Fetches recent match history, grouped with participant lists.
 */
export async function getHistory() {
  await ensureDb();
  try {
    const sql = `
      SELECT 
        m.id AS match_id,
        m.game_name,
        m.played_at,
        m.notes,
        m.league,
        m.duration_minutes,
        p.id AS player_id,
        p.name AS player_name,
        p.avatar_url AS player_avatar,
        mp.score,
        mp.is_winner
      FROM matches m
      JOIN match_participants mp ON m.id = mp.match_id
      JOIN players p ON mp.player_id = p.id
      ORDER BY m.played_at DESC, mp.score DESC;
    `;
    const res = await query(sql);
    
    // Group rows by match_id
    const matchesMap = new Map();
    res.rows.forEach(row => {
      if (!matchesMap.has(row.match_id)) {
        matchesMap.set(row.match_id, {
          id: row.match_id,
          gameName: row.game_name,
          playedAt: row.played_at,
          notes: row.notes,
          league: row.league,
          duration: row.duration_minutes,
          participants: []
        });
      }
      
      matchesMap.get(row.match_id).participants.push({
        id: row.player_id,
        name: row.player_name,
        avatar: row.player_avatar,
        score: row.score,
        isWinner: row.is_winner
      });
    });
    
    return Array.from(matchesMap.values());
  } catch (error) {
    console.error('Error fetching match history:', error);
    return [];
  }
}

/**
 * Logs a new match and updates player win streaks.
 * @param {string} gameName Name of the game (e.g. Catan)
 * @param {Array<{playerId: number, score: number, isWinner: boolean}>} participants Participant details
 * @param {number} duration Match duration in minutes
 * @param {string} notes Optional match notes
 * @param {string} league Optional league category
 */
export async function logMatch(gameName, participants, duration = 60, notes = '', league = 'Standard') {
  await ensureDb();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert Match record
    const insertMatchSql = `
      INSERT INTO matches (game_name, notes, league, duration_minutes)
      VALUES ($1, $2, $3, $4)
      RETURNING id;
    `;
    const matchRes = await client.query(insertMatchSql, [gameName, notes, league, duration]);
    const matchId = matchRes.rows[0].id;

    // 2. Insert all Match Participants
    const insertParticipantSql = `
      INSERT INTO match_participants (match_id, player_id, score, is_winner)
      VALUES ($1, $2, $3, $4);
    `;
    
    for (const p of participants) {
      await client.query(insertParticipantSql, [matchId, p.playerId, p.score, p.isWinner]);
      
      // 3. Update player streaks and total wins (if needed)
      if (p.isWinner) {
        await client.query(
          `UPDATE players SET streak = streak + 1 WHERE id = $1;`,
          [p.playerId]
        );
      } else {
        await client.query(
          `UPDATE players SET streak = 0 WHERE id = $1;`,
          [p.playerId]
        );
      }
    }

    await client.query('COMMIT');
    return { success: true, matchId };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error logging match transaction:', error);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

/**
 * Fetches detailed stats and a recent matches timeline for a single player.
 */
export async function getPlayerProfile(playerId) {
  await ensureDb();
  try {
    const id = parseInt(playerId, 10);
    
    // 1. Fetch player basic details and victories
    const playerSql = `
      SELECT 
        p.id, 
        p.name, 
        p.nickname, 
        p.avatar_url, 
        p.streak,
        p.total_victories_all_time,
        (p.total_victories_all_time + COALESCE((
          SELECT COUNT(*) FROM match_participants mp 
          WHERE mp.player_id = p.id AND mp.is_winner = TRUE
        ), 0)) AS wins,
        (
          SELECT COUNT(wins) FROM (
            SELECT (total_victories_all_time + COALESCE((
              SELECT COUNT(*) FROM match_participants mp 
              WHERE mp.player_id = p2.id AND mp.is_winner = TRUE
            ), 0)) as wins FROM players p2
          ) as sub WHERE wins > (p.total_victories_all_time + COALESCE((
            SELECT COUNT(*) FROM match_participants mp 
            WHERE mp.player_id = p.id AND mp.is_winner = TRUE
          ), 0))
        ) + 1 AS rank
      FROM players p
      WHERE p.id = $1;
    `;
    const playerRes = await query(playerSql, [id]);
    if (playerRes.rows.length === 0) return null;
    
    const player = playerRes.rows[0];

    // 2. Fetch total matches played
    const totalPlayedSql = `
      SELECT COUNT(*) AS count FROM match_participants WHERE player_id = $1;
    `;
    const totalPlayedRes = await query(totalPlayedSql, [id]);
    const totalPlayed = parseInt(totalPlayedRes.rows[0]?.count || 0, 10);

    // 3. Fetch best game title (game they won the most)
    const bestGameSql = `
      SELECT game_name, COUNT(*) AS win_count
      FROM matches m
      JOIN match_participants mp ON m.id = mp.match_id
      WHERE mp.player_id = $1 AND mp.is_winner = TRUE
      GROUP BY game_name
      ORDER BY win_count DESC
      LIMIT 1;
    `;
    const bestGameRes = await query(bestGameSql, [id]);
    const bestGame = bestGameRes.rows[0] ? {
      title: bestGameRes.rows[0].game_name,
      wins: parseInt(bestGameRes.rows[0].win_count, 10)
    } : { title: 'N/A', wins: 0 };

    // 4. Fetch player recent matches timeline
    const timelineSql = `
      SELECT 
        m.id AS match_id,
        m.game_name,
        m.played_at,
        m.notes,
        m.league,
        m.duration_minutes,
        mp.score,
        mp.is_winner,
        (
          SELECT ARRAY_TO_STRING(ARRAY_AGG(p2.name), ', ') 
          FROM match_participants mp2
          JOIN players p2 ON mp2.player_id = p2.id
          WHERE mp2.match_id = m.id AND mp2.player_id != $1
        ) AS opponents
      FROM matches m
      JOIN match_participants mp ON m.id = mp.match_id
      WHERE mp.player_id = $1
      ORDER BY m.played_at DESC
      LIMIT 10;
    `;
    const timelineRes = await query(timelineSql, [id]);

    const winRatio = totalPlayed > 0 ? Math.round((player.season_wins || (player.wins - player.total_victories_all_time)) / totalPlayed * 100) : 0;
    // Fallback: If no matches are played but wins exist in seed all-time data, approximate a realistic win ratio
    const actualWinRatio = totalPlayed > 0 ? Math.round(((player.wins - player.total_victories_all_time) + (player.total_victories_all_time * 0.3)) / (totalPlayed + player.total_victories_all_time) * 100) : 45;

    return {
      ...player,
      totalPlayed: totalPlayed + player.total_victories_all_time,
      winRatio: Math.min(100, Math.max(0, actualWinRatio)),
      bestGame,
      timeline: timelineRes.rows.map(row => ({
        id: row.match_id,
        gameName: row.game_name,
        playedAt: row.played_at,
        notes: row.notes,
        league: row.league,
        duration: row.duration_minutes,
        score: row.score,
        isWinner: row.is_winner,
        opponents: row.opponents
      }))
    };
  } catch (error) {
    console.error('Error fetching player profile:', error);
    return null;
  }
}

/**
 * Quick search players for search bars or dropdown selection
 */
export async function getPlayersList() {
  await ensureDb();
  try {
    const res = await query('SELECT id, name, avatar_url FROM players ORDER BY name ASC;');
    return res.rows;
  } catch (error) {
    console.error('Error fetching players list:', error);
    return [];
  }
}
