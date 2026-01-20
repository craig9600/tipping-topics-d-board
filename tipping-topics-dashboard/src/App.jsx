import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = {
  navy: '#1e3a5f',
  navyDark: '#152a45',
  gold: '#f4b942',
  goldLight: '#f7c85c',
  white: '#ffffff',
  grayLight: '#e5e7eb',
  green: '#22c55e',
  red: '#ef4444'
};

// Stat Card Component
const StatCard = ({ label, value, suffix = '', prefix = '', highlight = false }) => (
  <div style={{
    backgroundColor: highlight ? COLORS.gold : COLORS.navyDark,
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    border: highlight ? 'none' : `1px solid ${COLORS.navy}`
  }}>
    <div style={{
      fontSize: '14px',
      color: highlight ? COLORS.navyDark : COLORS.grayLight,
      marginBottom: '8px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {label}
    </div>
    <div style={{
      fontSize: '36px',
      fontWeight: 'bold',
      color: highlight ? COLORS.navyDark : COLORS.gold
    }}>
      {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
    </div>
  </div>
);

// League Row Component
const LeagueRow = ({ league, tips, wins, winRate, profit, roi }) => (
  <tr style={{ borderBottom: `1px solid ${COLORS.navy}` }}>
    <td style={{ padding: '16px', color: COLORS.white, fontWeight: '500' }}>{league}</td>
    <td style={{ padding: '16px', color: COLORS.grayLight, textAlign: 'center' }}>{tips}</td>
    <td style={{ padding: '16px', color: COLORS.grayLight, textAlign: 'center' }}>{wins}</td>
    <td style={{ padding: '16px', color: COLORS.grayLight, textAlign: 'center' }}>{winRate}%</td>
    <td style={{ 
      padding: '16px', 
      textAlign: 'center',
      color: profit >= 0 ? COLORS.green : COLORS.red,
      fontWeight: '600'
    }}>
      £{profit.toFixed(2)}
    </td>
    <td style={{ 
      padding: '16px', 
      textAlign: 'center',
      color: roi >= 0 ? COLORS.green : COLORS.red,
      fontWeight: '600'
    }}>
      {roi > 0 ? '+' : ''}{roi}%
    </td>
  </tr>
);

// Winner Card Component
const WinnerCard = ({ date, homeTeam, awayTeam, market, odds, league, profit }) => {
  const marketLabel = {
    'home_win': homeTeam,
    'away_win': awayTeam,
    'draw': 'Draw'
  }[market] || market;

  return (
    <div style={{
      backgroundColor: COLORS.navyDark,
      borderRadius: '12px',
      padding: '16px',
      borderLeft: `4px solid ${COLORS.green}`
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <span style={{ color: COLORS.grayLight, fontSize: '12px' }}>{date}</span>
        <span style={{ 
          backgroundColor: COLORS.green + '20',
          color: COLORS.green,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          +£{profit.toFixed(2)}
        </span>
      </div>
      <div style={{ color: COLORS.white, fontWeight: '600', marginBottom: '4px' }}>
        {homeTeam} vs {awayTeam}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        color: COLORS.grayLight,
        fontSize: '14px'
      }}>
        <span>{marketLabel} @ {odds.toFixed(2)}</span>
        <span>{league}</span>
      </div>
    </div>
  );
};

// Pending Tip Card Component
const PendingTipCard = ({ date, homeTeam, awayTeam, market, odds, league }) => {
  const marketLabel = {
    'home_win': homeTeam,
    'away_win': awayTeam,
    'draw': 'Draw'
  }[market] || market;

  return (
    <div style={{
      backgroundColor: COLORS.navyDark,
      borderRadius: '12px',
      padding: '16px',
      borderLeft: `4px solid ${COLORS.gold}`
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <span style={{ color: COLORS.grayLight, fontSize: '12px' }}>{date}</span>
        <span style={{ 
          backgroundColor: COLORS.gold + '20',
          color: COLORS.gold,
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          PENDING
        </span>
      </div>
      <div style={{ color: COLORS.white, fontWeight: '600', marginBottom: '4px' }}>
        {homeTeam} vs {awayTeam}
      </div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        color: COLORS.grayLight,
        fontSize: '14px'
      }}>
        <span>{marketLabel} @ {odds.toFixed(2)}</span>
        <span>{league}</span>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/dashboard_data.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load data');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: COLORS.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.gold
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: COLORS.navy,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: COLORS.red
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>Error loading data</div>
          <div style={{ color: COLORS.grayLight }}>{error}</div>
        </div>
      </div>
    );
  }

  const { overall_stats, league_breakdown, recent_winners, monthly_performance, streak, pending_tips } = data;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.navy,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: COLORS.navyDark,
        padding: '24px',
        borderBottom: `1px solid ${COLORS.navy}`
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: COLORS.gold,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '24px',
              color: COLORS.navyDark
            }}>
              TT
            </div>
            <div>
              <h1 style={{ margin: 0, color: COLORS.gold, fontSize: '24px', fontWeight: 'bold' }}>
                TIPPING TOPICS
              </h1>
              <p style={{ margin: 0, color: COLORS.grayLight, fontSize: '14px' }}>
                Football Betting Insights
              </p>
            </div>
          </div>
          <div style={{ color: COLORS.grayLight, fontSize: '14px' }}>
            Last updated: {data.last_updated}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard label="Total Tips" value={overall_stats.total_tips} />
          <StatCard label="Win Rate" value={overall_stats.win_rate} suffix="%" />
          <StatCard 
            label="ROI" 
            value={overall_stats.roi} 
            suffix="%" 
            prefix={overall_stats.roi > 0 ? '+' : ''}
            highlight={overall_stats.roi > 0}
          />
          <StatCard 
            label="Profit (£10 stakes)" 
            value={overall_stats.profit.toFixed(2)} 
            prefix="£"
            highlight={overall_stats.profit > 0}
          />
          <StatCard 
            label={`Current ${streak.type === 'win' ? 'Win' : 'Loss'} Streak`}
            value={streak.count}
          />
        </div>

        {/* Profit Chart */}
        {monthly_performance.length > 0 && (
          <div style={{
            backgroundColor: COLORS.navyDark,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h2 style={{ color: COLORS.white, marginTop: 0, marginBottom: '24px' }}>
              Cumulative Profit
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthly_performance}>
                <XAxis 
                  dataKey="month" 
                  stroke={COLORS.grayLight}
                  tick={{ fill: COLORS.grayLight, fontSize: 12 }}
                />
                <YAxis 
                  stroke={COLORS.grayLight}
                  tick={{ fill: COLORS.grayLight, fontSize: 12 }}
                  tickFormatter={(v) => `£${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: COLORS.navy,
                    border: `1px solid ${COLORS.gold}`,
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: COLORS.gold }}
                  itemStyle={{ color: COLORS.white }}
                  formatter={(value) => [`£${value.toFixed(2)}`, 'Profit']}
                />
                <Line
                  type="monotone"
                  dataKey="cumulative_profit"
                  stroke={COLORS.gold}
                  strokeWidth={3}
                  dot={{ fill: COLORS.gold, strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: COLORS.goldLight }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Two Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* League Breakdown */}
          <div style={{
            backgroundColor: COLORS.navyDark,
            borderRadius: '12px',
            padding: '24px',
            overflow: 'auto'
          }}>
            <h2 style={{ color: COLORS.white, marginTop: 0, marginBottom: '24px' }}>
              League Breakdown
            </h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.gold}` }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: COLORS.gold }}>League</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.gold }}>Tips</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.gold }}>Wins</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.gold }}>Win %</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.gold }}>Profit</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: COLORS.gold }}>ROI</th>
                </tr>
              </thead>
              <tbody>
                {league_breakdown.map((league, i) => (
                  <LeagueRow
                    key={i}
                    league={league.league}
                    tips={league.tips}
                    wins={league.wins}
                    winRate={league.win_rate}
                    profit={league.profit}
                    roi={league.roi}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent Winners */}
          <div style={{
            backgroundColor: COLORS.navyDark,
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{ color: COLORS.white, marginTop: 0, marginBottom: '24px' }}>
              Recent Winners 🏆
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recent_winners.length > 0 ? (
                recent_winners.map((winner, i) => (
                  <WinnerCard
                    key={i}
                    date={winner.date}
                    homeTeam={winner.home_team}
                    awayTeam={winner.away_team}
                    market={winner.market}
                    odds={winner.odds}
                    league={winner.league}
                    profit={winner.profit}
                  />
                ))
              ) : (
                <div style={{ color: COLORS.grayLight, textAlign: 'center', padding: '32px' }}>
                  No winners yet - check back soon!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Tips */}
        {pending_tips.length > 0 && (
          <div style={{
            backgroundColor: COLORS.navyDark,
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h2 style={{ color: COLORS.white, marginTop: 0, marginBottom: '24px' }}>
              Upcoming Tips ⏳
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px'
            }}>
              {pending_tips.map((tip, i) => (
                <PendingTipCard
                  key={i}
                  date={tip.date}
                  homeTeam={tip.home_team}
                  awayTeam={tip.away_team}
                  market={tip.market}
                  odds={tip.odds}
                  league={tip.league}
                />
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          marginTop: '48px',
          padding: '24px',
          backgroundColor: COLORS.navyDark,
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <p style={{ color: COLORS.grayLight, fontSize: '12px', margin: 0 }}>
            ⚠️ Gambling involves risk. Past performance does not guarantee future results. 
            Please bet responsibly. 18+ only.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: COLORS.navyDark,
        padding: '24px',
        marginTop: '48px',
        borderTop: `1px solid ${COLORS.navy}`,
        textAlign: 'center'
      }}>
        <p style={{ color: COLORS.grayLight, margin: 0 }}>
          © 2025 Tipping Topics. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
